import type { Reuniao } from "@/types"
import { reunioes as mockReunioes } from "@/mocks"

let reunioes: Reuniao[] = [...mockReunioes]

async function delay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 50))
}

export const reuniaoService = {
  async getAll(): Promise<Reuniao[]> {
    await delay()
    return [...reunioes]
  },

  async getByLider(liderId: string): Promise<Reuniao[]> {
    await delay()
    return reunioes.filter((r) => r.liderId === liderId)
  },

  async getByCorporativo(corporativoId: string): Promise<Reuniao[]> {
    await delay()
    return reunioes.filter((r) => r.corporativoId === corporativoId)
  },

  async getBySemana(semana: number): Promise<Reuniao[]> {
    await delay()
    return reunioes.filter((r) => r.semana === semana)
  },

  async create(data: Omit<Reuniao, "id">): Promise<Reuniao> {
    await delay()
    const nova: Reuniao = {
      ...data,
      id: `R${String(reunioes.length + 1).padStart(3, "0")}`,
    }
    reunioes.push(nova)
    return nova
  },

  async update(id: string, data: Partial<Reuniao>): Promise<Reuniao> {
    await delay()
    const idx = reunioes.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error("Reunião não encontrada")
    reunioes[idx] = { ...reunioes[idx], ...data }
    return reunioes[idx]
  },

  async delete(id: string): Promise<void> {
    await delay()
    reunioes = reunioes.filter((r) => r.id !== id)
  },
}
