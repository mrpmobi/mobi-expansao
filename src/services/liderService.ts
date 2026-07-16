import type { Lider, Cidade, SemanaPrograma, FeedbackItem, Classificacao, ProgramStatus } from "@/types"
import { lideres as mockLideres } from "@/mocks"

let lideres: Lider[] = [...mockLideres]

function calcularScore(itens: FeedbackItem[]): number {
  const totalPeso = itens.reduce((a, i) => a + i.peso, 0)
  const ponderado = itens.reduce((a, i) => a + (i.nota * i.peso) / 100, 0)
  return Math.round((ponderado / totalPeso) * 100)
}

function calcularClassificacao(score: number): Classificacao {
  if (score >= 70) return "ouro"
  if (score >= 40) return "prata"
  return "vermelho"
}

function gerarFeedback(score: number, classificacao: Classificacao): string {
  const partes = [
    "Pelas informações registradas durante as quatro semanas,",
  ]
  if (score >= 70) {
    partes.push(
      "o líder apresentou excelente comprometimento, boa evolução nas cidades,"
    )
    partes.push(`atingiu ${score}% da meta e demonstrou capacidade de liderança.`)
    partes.push(
      classificacao === "ouro"
        ? "Recomendação: classificação Ouro e expansão para novas cidades."
        : "Recomendação: manter o ritmo e buscar melhoria contínua."
    )
  } else if (score >= 40) {
    partes.push(
      "o líder apresentou desempenho moderado, com alguns pontos de atenção,"
    )
    partes.push(`atingiu ${score}% da meta.`)
    partes.push(
      "Recomendação: programa de recuperação com foco em execução e liderança."
    )
  } else {
    partes.push("o líder apresentou baixo desempenho durante o programa,")
    partes.push(`atingiu apenas ${score}% da meta.`)
    partes.push(
      "Recomendação: avaliação de substituição ou realocação."
    )
  }
  return partes.join(" ")
}

async function delay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 50))
}

export const liderService = {
  async getAll(): Promise<Lider[]> {
    await delay()
    return [...lideres]
  },

  async getById(id: string): Promise<Lider | undefined> {
    await delay()
    return lideres.find((l) => l.id === id)
  },

  async create(data: Omit<Lider, "id" | "cidades" | "semanas" | "classificacao" | "score" | "feedback" | "feedbackItens" | "status">): Promise<Lider> {
    await delay()
    const novo: Lider = {
      ...data,
      id: `L${String(lideres.length + 1).padStart(3, "0")}`,
      status: "ativo",
      cidades: [],
      semanas: [
        { semana: 1, tipo: "diagnostico", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
        { semana: 2, tipo: "execucao", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
        { semana: 3, tipo: "recuperacao", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
        { semana: 4, tipo: "avaliacao", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
      ],
      classificacao: "prata",
      score: 0,
      feedback: "",
      feedbackItens: [
        { criterio: "Meta", nota: 0, peso: 30 },
        { criterio: "Comprometimento", nota: 0, peso: 20 },
        { criterio: "Execução", nota: 0, peso: 20 },
        { criterio: "Liderança", nota: 0, peso: 15 },
        { criterio: "Participação", nota: 0, peso: 10 },
        { criterio: "Resultado", nota: 0, peso: 5 },
      ],
      programStatus: "nao_iniciado",
      dataInicioPrograma: "",
    }
    lideres.push(novo)
    return novo
  },

  async update(id: string, data: Partial<Lider>): Promise<Lider> {
    await delay()
    const idx = lideres.findIndex((l) => l.id === id)
    if (idx === -1) throw new Error("Líder não encontrado")
    lideres[idx] = { ...lideres[idx], ...data }
    return lideres[idx]
  },

  async delete(id: string): Promise<void> {
    await delay()
    lideres = lideres.filter((l) => l.id !== id)
  },

  async addCidade(liderId: string, cidade: Omit<Cidade, "id">): Promise<Lider> {
    await delay()
    const lider = lideres.find((l) => l.id === liderId)
    if (!lider) throw new Error("Líder não encontrado")
    const novaCidade: Cidade = { ...cidade, id: crypto.randomUUID() }
    lider.cidades.push(novaCidade)
    return lider
  },

  async updateCidade(liderId: string, cidadeId: string, data: Partial<Cidade>): Promise<Lider> {
    await delay()
    const lider = lideres.find((l) => l.id === liderId)
    if (!lider) throw new Error("Líder não encontrado")
    const cIdx = lider.cidades.findIndex((c) => c.id === cidadeId)
    if (cIdx === -1) throw new Error("Cidade não encontrada")
    lider.cidades[cIdx] = { ...lider.cidades[cIdx], ...data }
    return lider
  },

  async deleteCidade(liderId: string, cidadeId: string): Promise<Lider> {
    await delay()
    const lider = lideres.find((l) => l.id === liderId)
    if (!lider) throw new Error("Líder não encontrado")
    lider.cidades = lider.cidades.filter((c) => c.id !== cidadeId)
    return lider
  },

  async updateSemana(liderId: string, semanaIdx: number, data: Partial<SemanaPrograma>): Promise<Lider> {
    await delay()
    const lider = lideres.find((l) => l.id === liderId)
    if (!lider) throw new Error("Líder não encontrado")
    if (!lider.semanas[semanaIdx]) throw new Error("Semana não encontrada")
    lider.semanas[semanaIdx] = { ...lider.semanas[semanaIdx], ...data }

    const allNotas = lider.semanas.map((s) => s.nota)
    const avg =
      allNotas.filter((n) => n > 0).reduce((a, b) => a + b, 0) /
      Math.max(allNotas.filter((n) => n > 0).length, 1)

    const totalCorridasLider = lider.cidades.reduce((a, c) => a + c.corridas, 0)
    const metaScore =
      totalCorridasLider >= 300
        ? 100
        : Math.round((totalCorridasLider / 300) * 100)

    lider.feedbackItens = lider.feedbackItens.map((item) => {
      if (item.criterio === "Meta") return { ...item, nota: metaScore }
      if (item.criterio === "Execução") return { ...item, nota: Math.round(avg) }
      if (item.criterio === "Comprometimento")
        return { ...item, nota: Math.round(avg) }
      return item
    })

    lider.score = calcularScore(lider.feedbackItens)
    lider.classificacao = calcularClassificacao(lider.score)
    lider.feedback = gerarFeedback(lider.score, lider.classificacao)
    lider.status =
      lider.score >= 60
        ? "ativo"
        : lider.score >= 30
          ? "recuperacao"
          : "inativo"

    return lider
  },

  async startProgram(liderId: string): Promise<Lider> {
    await delay()
    const lider = lideres.find((l) => l.id === liderId)
    if (!lider) throw new Error("Líder não encontrado")
    lider.programStatus = "semana_1"
    lider.dataInicioPrograma = new Date().toISOString().split("T")[0]
    return lider
  },

  async concludeWeek(liderId: string, semanaIdx: number): Promise<Lider> {
    await delay()
    const lider = lideres.find((l) => l.id === liderId)
    if (!lider) throw new Error("Líder não encontrado")
    if (!lider.semanas[semanaIdx]) throw new Error("Semana não encontrada")

    lider.semanas[semanaIdx].concluida = true

    const nextStatus: Record<number, ProgramStatus> = {
      0: "semana_2",
      1: "semana_3",
      2: "semana_4",
      3: "finalizado",
    }
    lider.programStatus = nextStatus[semanaIdx]

    if (semanaIdx === 3) {
      const allNotas = lider.semanas.map((s) => s.nota)
      const avg = allNotas.filter((n) => n > 0).reduce((a, b) => a + b, 0) / Math.max(allNotas.filter((n) => n > 0).length, 1)
      const totalCorridasLider = lider.cidades.reduce((a, c) => a + c.corridas, 0)
      const metaScore = totalCorridasLider >= 300 ? 100 : Math.round((totalCorridasLider / 300) * 100)

      lider.feedbackItens = lider.feedbackItens.map((item) => {
        if (item.criterio === "Meta") return { ...item, nota: metaScore }
        if (item.criterio === "Execução") return { ...item, nota: Math.round(avg) }
        if (item.criterio === "Comprometimento") return { ...item, nota: Math.round(avg) }
        return item
      })

      lider.score = calcularScore(lider.feedbackItens)
      lider.classificacao = calcularClassificacao(lider.score)
      lider.feedback = gerarFeedback(lider.score, lider.classificacao)
      lider.status = lider.score >= 60 ? "ativo" : lider.score >= 30 ? "recuperacao" : "inativo"
    }

    return lider
  },

  async updateFeedbackItens(
    liderId: string,
    itens: FeedbackItem[]
  ): Promise<Lider> {
    await delay()
    const lider = lideres.find((l) => l.id === liderId)
    if (!lider) throw new Error("Líder não encontrado")
    lider.feedbackItens = itens
    lider.score = calcularScore(itens)
    lider.classificacao = calcularClassificacao(lider.score)
    lider.feedback = gerarFeedback(lider.score, lider.classificacao)
    lider.status =
      lider.score >= 60
        ? "ativo"
        : lider.score >= 30
          ? "recuperacao"
          : "inativo"
    return lider
  },
}
