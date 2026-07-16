import type { DashboardIndicadores, Lider, Corporativo } from "@/types"
import { liderService } from "./liderService"

export const dashboardService = {
  async getIndicadores(): Promise<DashboardIndicadores> {
    const lideres = await liderService.getAll()
    const totalCidades = lideres.reduce((a, l) => a + l.cidades.length, 0)
    const totalCorridas = lideres.reduce(
      (a, l) => a + l.cidades.reduce((b, c) => b + c.corridas, 0),
      0
    )
    const META_POR_LIDER = 300

    const lideresAcimaMeta = lideres.filter((l) => {
      const totalDoLider = l.cidades.reduce((b, c) => b + c.corridas, 0)
      return totalDoLider >= META_POR_LIDER
    }).length

    return {
      totalLideres: lideres.length,
      totalCorporativos: 4,
      totalCidades,
      totalCorridas,
      lideresAtivos: lideres.filter((l) => l.status === "ativo").length,
      lideresEmPrograma: lideres.filter(
        (l) => l.programStatus !== "nao_iniciado" && l.programStatus !== "finalizado"
      ).length,
      lideresFinalizados: lideres.filter((l) => l.programStatus === "finalizado").length,
      metaPrograma: lideres.length * META_POR_LIDER,
      lideresAcimaMeta,
      lideresAbaixoMeta: lideres.length - lideresAcimaMeta,
      lideresOuro: lideres.filter((l) => l.classificacao === "ouro").length,
      lideresPrata: lideres.filter((l) => l.classificacao === "prata").length,
      lideresVermelho: lideres.filter((l) => l.classificacao === "vermelho").length,
      lideresEmRisco: lideres.filter(
        (l) => l.classificacao === "vermelho" || l.status === "inativo"
      ).length,
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
    const lideres = await liderService.getAll()
    return [...lideres]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((l) => ({
        id: l.id,
        nome: l.nome,
        score: l.score,
        classificacao: l.classificacao,
        mentorId: l.mentorId,
        totalCorridas: l.cidades.reduce((a, c) => a + c.corridas, 0),
        faturamento: l.cidades.reduce((a, c) => a + c.faturamento, 0),
      }))
  },

  async getRankingCorporativos(corporativos: Corporativo[]) {
    const lideres = await liderService.getAll()
    return corporativos.map((corp) => {
      const lideresDoCorp = lideres.filter((l) => l.mentorId === corp.id)
      return {
        ...corp,
        totalLideres: lideresDoCorp.length,
        scoreMedio: Math.round(
          lideresDoCorp.reduce((a, l) => a + l.score, 0) /
            Math.max(lideresDoCorp.length, 1)
        ),
        totalCorridas: lideresDoCorp.reduce(
          (a, l) => a + l.cidades.reduce((b, c) => b + c.corridas, 0),
          0
        ),
        faturamento: lideresDoCorp.reduce(
          (a, l) => a + l.cidades.reduce((b, c) => b + c.faturamento, 0),
          0
        ),
      }
    })
  },

  async getDadosPorCorporativo(corporativoId: string) {
    const lideres = await liderService.getAll()
    const filtrados = lideres.filter((l) => l.mentorId === corporativoId)
    return filtrados.map((l) => ({
      nome: l.nome,
      score: l.score,
      corridas: l.cidades.reduce((a, c) => a + c.corridas, 0),
      faturamento: l.cidades.reduce((a, c) => a + c.faturamento, 0),
    }))
  },
}
