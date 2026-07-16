import type { Reuniao } from "@/types"
import type { InValue } from "@libsql/client"
import { db } from "@/lib/db"

function rowToReuniao(row: Record<string, unknown>): Reuniao {
  return {
    id: row.id as string,
    semana: row.semana as number,
    data: row.data as string,
    corporativoId: row.corporativoId as string,
    liderId: row.liderId as string,
    situacaoGeral: row.situacaoGeral as string,
    motoristas: row.motoristas as number,
    passageiros: row.passageiros as number,
    corridas: row.corridas as number,
    campanhas: row.campanhas as string,
    visitas: row.visitas as number,
    reunioes: row.reunioes as number,
    principaisDificuldades: row.principaisDificuldades as string,
    planoProximaSemana: row.planoProximaSemana as string,
  }
}

export const reuniaoService = {
  async getAll(): Promise<Reuniao[]> {
    const result = await db.execute("SELECT * FROM reunioes ORDER BY id")
    return result.rows.map(rowToReuniao)
  },

  async getByLider(liderId: string): Promise<Reuniao[]> {
    const result = await db.execute({
      sql: "SELECT * FROM reunioes WHERE liderId = ? ORDER BY semana",
      args: [liderId],
    })
    return result.rows.map(rowToReuniao)
  },

  async getByCorporativo(corporativoId: string): Promise<Reuniao[]> {
    const result = await db.execute({
      sql: "SELECT * FROM reunioes WHERE corporativoId = ? ORDER BY semana",
      args: [corporativoId],
    })
    return result.rows.map(rowToReuniao)
  },

  async getBySemana(semana: number): Promise<Reuniao[]> {
    const result = await db.execute({
      sql: "SELECT * FROM reunioes WHERE semana = ? ORDER BY id",
      args: [semana],
    })
    return result.rows.map(rowToReuniao)
  },

  async create(data: Omit<Reuniao, "id">): Promise<Reuniao> {
    const countResult = await db.execute("SELECT COUNT(*) as cnt FROM reunioes")
    const nextIdx = (countResult.rows[0].cnt as number) + 1
    const newId = `R${String(nextIdx).padStart(3, "0")}`

    await db.execute({
      sql: `INSERT INTO reunioes (id, semana, data, corporativoId, liderId, situacaoGeral, motoristas, passageiros, corridas, campanhas, visitas, reunioes, principaisDificuldades, planoProximaSemana) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId,
        data.semana,
        data.data,
        data.corporativoId,
        data.liderId,
        data.situacaoGeral,
        data.motoristas,
        data.passageiros,
        data.corridas,
        data.campanhas,
        data.visitas,
        data.reunioes,
        data.principaisDificuldades,
        data.planoProximaSemana,
      ],
    })

    const result = await db.execute({
      sql: "SELECT * FROM reunioes WHERE id = ?",
      args: [newId],
    })
    return rowToReuniao(result.rows[0])
  },

  async update(id: string, data: Partial<Reuniao>): Promise<Reuniao> {
    const existing = await db.execute({
      sql: "SELECT * FROM reunioes WHERE id = ?",
      args: [id],
    })
    if (existing.rows.length === 0) throw new Error("Reunião não encontrada")

    const fields: string[] = []
    const args: InValue[] = []

    const updatable = [
      "semana", "data", "corporativoId", "liderId", "situacaoGeral",
      "motoristas", "passageiros", "corridas", "campanhas", "visitas",
      "reunioes", "principaisDificuldades", "planoProximaSemana",
    ] as const

    for (const key of updatable) {
      if (key in data) {
        fields.push(`${key} = ?`)
        args.push(data[key] as InValue)
      }
    }

    if (fields.length > 0) {
      args.push(id)
      await db.execute({
        sql: `UPDATE reunioes SET ${fields.join(", ")} WHERE id = ?`,
        args,
      })
    }

    const result = await db.execute({
      sql: "SELECT * FROM reunioes WHERE id = ?",
      args: [id],
    })
    return rowToReuniao(result.rows[0])
  },

  async delete(id: string): Promise<void> {
    await db.execute({ sql: "DELETE FROM reunioes WHERE id = ?", args: [id] })
  },
}
