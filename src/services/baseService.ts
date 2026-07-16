import type { Diretor, Corporativo } from "@/types"
import { db } from "@/lib/db"

export const baseService = {
  async getDiretores(): Promise<Diretor[]> {
    const result = await db.execute("SELECT * FROM diretores ORDER BY id")
    return result.rows.map((r) => ({
      id: r.id as string,
      nome: r.nome as string,
      email: r.email as string,
    }))
  },

  async getCorporativos(): Promise<Corporativo[]> {
    const result = await db.execute("SELECT * FROM corporativos ORDER BY id")
    return result.rows.map((r) => ({
      id: r.id as string,
      nome: r.nome as string,
      email: r.email as string,
      telefone: r.telefone as string,
      regiao: r.regiao as Corporativo["regiao"],
    }))
  },
}
