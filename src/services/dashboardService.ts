import type { DashboardIndicadores, Corporativo } from "@/types"
import { db } from "@/lib/db"

export const dashboardService = {
  async getIndicadores(): Promise<DashboardIndicadores> {
    const [liderResult, cidadeResult, corridasResult] = await db.batch([
      {
        sql: `SELECT
          COUNT(*) as totalLideres,
          SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) as lideresAtivos,
          SUM(CASE WHEN programStatus != 'nao_iniciado' AND programStatus != 'finalizado' THEN 1 ELSE 0 END) as lideresEmPrograma,
          SUM(CASE WHEN programStatus = 'finalizado' THEN 1 ELSE 0 END) as lideresFinalizados,
          SUM(CASE WHEN classificacao = 'ouro' THEN 1 ELSE 0 END) as lideresOuro,
          SUM(CASE WHEN classificacao = 'prata' THEN 1 ELSE 0 END) as lideresPrata,
          SUM(CASE WHEN classificacao = 'vermelho' THEN 1 ELSE 0 END) as lideresVermelho,
          SUM(CASE WHEN classificacao = 'vermelho' OR status = 'inativo' THEN 1 ELSE 0 END) as lideresEmRisco
        FROM lideres`,
      },
      { sql: `SELECT COUNT(*) as totalCidades FROM cidades` },
      {
        sql: `SELECT
          COALESCE(SUM(c.corridas), 0) as totalCorridas,
          COUNT(DISTINCT l.id) as totalLideres
        FROM lideres l
        LEFT JOIN cidades c ON c.liderId = l.id` },
    ])

    const l = liderResult.rows[0]
    const totalCidades = cidadeResult.rows[0].totalCidades as number
    const totalCorridas = corridasResult.rows[0].totalCorridas as number
    const totalLideres = l.totalLideres as number
    const META_POR_LIDER = 300

    const acimaMetaResult = await db.execute({
      sql: `SELECT COUNT(*) as cnt FROM (
        SELECT l.id FROM lideres l
        LEFT JOIN cidades c ON c.liderId = l.id
        GROUP BY l.id
        HAVING COALESCE(SUM(c.corridas), 0) >= ?
      )`,
      args: [META_POR_LIDER],
    })
    const lideresAcimaMeta = acimaMetaResult.rows[0].cnt as number

    return {
      totalLideres,
      totalCorporativos: 4,
      totalCidades,
      totalCorridas,
      lideresAtivos: l.lideresAtivos as number,
      lideresEmPrograma: l.lideresEmPrograma as number,
      lideresFinalizados: l.lideresFinalizados as number,
      metaPrograma: totalLideres * META_POR_LIDER,
      lideresAcimaMeta,
      lideresAbaixoMeta: totalLideres - lideresAcimaMeta,
      lideresOuro: l.lideresOuro as number,
      lideresPrata: l.lideresPrata as number,
      lideresVermelho: l.lideresVermelho as number,
      lideresEmRisco: l.lideresEmRisco as number,
    }
  },

  async getEvolucaoSemanal() {
    return [
      { semana: "Semana 1", corridas: 12000, faturamento: 450000 },
      { semana: "Semana 2", corridas: 15000, faturamento: 520000 },
      { semana: "Semana 3", corridas: 18000, faturamento: 610000 },
      { semana: "Semana 4", corridas: 22000, faturamento: 750000 },
    ]
  },

  async getRankingLideres() {
    const result = await db.execute({
      sql: `SELECT
        l.id, l.nome, l.score, l.classificacao, l.mentorId,
        COALESCE(SUM(c.corridas), 0) as totalCorridas,
        COALESCE(SUM(c.faturamento), 0) as faturamento
      FROM lideres l
      LEFT JOIN cidades c ON c.liderId = l.id
      GROUP BY l.id
      ORDER BY l.score DESC
      LIMIT 20`,
    })
    return result.rows.map((r) => ({
      id: r.id as string,
      nome: r.nome as string,
      score: r.score as number,
      classificacao: r.classificacao as DashboardIndicadores extends { lideresOuro: infer _ } ? string : never,
      mentorId: r.mentorId as string,
      totalCorridas: r.totalCorridas as number,
      faturamento: r.faturamento as number,
    }))
  },

  async getRankingCorporativos(corporativos: Corporativo[]) {
    const result = await db.execute({
      sql: `SELECT
        l.mentorId,
        COUNT(DISTINCT l.id) as totalLideres,
        ROUND(AVG(l.score)) as scoreMedio,
        COALESCE(SUM(c.corridas), 0) as totalCorridas,
        COALESCE(SUM(c.faturamento), 0) as faturamento
      FROM lideres l
      LEFT JOIN cidades c ON c.liderId = l.id
      GROUP BY l.mentorId`,
    })

    const byMentor = new Map<string, typeof result.rows[0]>()
    for (const row of result.rows) {
      byMentor.set(row.mentorId as string, row)
    }

    return corporativos.map((corp) => {
      const stats = byMentor.get(corp.id)
      return {
        ...corp,
        totalLideres: (stats?.totalLideres as number) || 0,
        scoreMedio: (stats?.scoreMedio as number) || 0,
        totalCorridas: (stats?.totalCorridas as number) || 0,
        faturamento: (stats?.faturamento as number) || 0,
      }
    })
  },

  async getDadosPorCorporativo(corporativoId: string) {
    const result = await db.execute({
      sql: `SELECT
        l.nome, l.score,
        COALESCE(SUM(c.corridas), 0) as corridas,
        COALESCE(SUM(c.faturamento), 0) as faturamento
      FROM lideres l
      LEFT JOIN cidades c ON c.liderId = l.id
      WHERE l.mentorId = ?
      GROUP BY l.id`,
      args: [corporativoId],
    })
    return result.rows.map((r) => ({
      nome: r.nome as string,
      score: r.score as number,
      corridas: r.corridas as number,
      faturamento: r.faturamento as number,
    }))
  },
}
