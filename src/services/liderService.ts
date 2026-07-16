import type { Lider, Cidade, SemanaPrograma, FeedbackItem, Classificacao, ProgramStatus } from "@/types"
import type { InValue, ResultSet } from "@libsql/client"
import { db } from "@/lib/db"

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

function rowToCidade(r: Record<string, unknown>): Cidade {
  return {
    id: r.id as string,
    nome: r.nome as string,
    estado: r.estado as string,
    motoristasAtivos: r.motoristasAtivos as number,
    passageirosAtivos: r.passageirosAtivos as number,
    corridas: r.corridas as number,
    faturamento: r.faturamento as number,
    ticketMedio: r.ticketMedio as number,
    metaCorridas: r.metaCorridas as number,
    observacoes: r.observacoes as string,
  }
}

function rowToSemana(r: Record<string, unknown>): SemanaPrograma {
  return {
    semana: r.semana as number,
    tipo: r.tipo as SemanaPrograma["tipo"],
    objetivo: r.objetivo as string,
    acoesPlanejadas: r.acoesPlanejadas as string,
    acoesExecutadas: r.acoesExecutadas as string,
    dificuldades: r.dificuldades as string,
    observacoes: r.observacoes as string,
    nota: r.nota as number,
    concluida: (r.concluida as number) === 1,
  }
}

function rowToFeedbackItem(r: Record<string, unknown>): FeedbackItem {
  return {
    criterio: r.criterio as string,
    nota: r.nota as number,
    peso: r.peso as number,
  }
}

function rowToLider(
  row: Record<string, unknown>,
  cidades: Cidade[],
  semanas: SemanaPrograma[],
  feedbackItens: FeedbackItem[]
): Lider {
  return {
    id: row.id as string,
    nome: row.nome as string,
    telefone: row.telefone as string,
    whatsApp: row.whatsApp as string,
    regiao: row.regiao as Lider["regiao"],
    estado: row.estado as string,
    status: row.status as Lider["status"],
    mentorId: row.mentorId as string,
    dataInicio: row.dataInicio as string,
    observacoes: row.observacoes as string,
    classificacao: row.classificacao as Classificacao,
    score: row.score as number,
    feedback: row.feedback as string,
    programStatus: row.programStatus as ProgramStatus,
    dataInicioPrograma: row.dataInicioPrograma as string,
    cidades,
    semanas,
    feedbackItens,
  }
}

async function loadLiderBatch(liderIds: string[]): Promise<Lider[]> {
  if (liderIds.length === 0) return []

  const stmts = [
    { sql: `SELECT * FROM lideres WHERE id IN (${liderIds.map(() => "?").join(",")}) ORDER BY id`, args: liderIds as InValue[] },
    ...liderIds.flatMap((id) => [
      { sql: "SELECT * FROM cidades WHERE liderId = ?", args: [id] as InValue[] },
      { sql: "SELECT * FROM semanas WHERE liderId = ? ORDER BY semana", args: [id] as InValue[] },
      { sql: "SELECT * FROM feedback_itens WHERE liderId = ?", args: [id] as InValue[] },
    ]),
  ]

  const results = await db.batch(stmts)
  const liderRows = results[0].rows

  const cidadesMap = new Map<string, Cidade[]>()
  const semanasMap = new Map<string, SemanaPrograma[]>()
  const feedbackMap = new Map<string, FeedbackItem[]>()

  let idx = 1
  for (const id of liderIds) {
    cidadesMap.set(id, results[idx].rows.map(rowToCidade))
    semanasMap.set(id, results[idx + 1].rows.map(rowToSemana))
    feedbackMap.set(id, results[idx + 2].rows.map(rowToFeedbackItem))
    idx += 3
  }

  return liderRows.map((row) =>
    rowToLider(
      row,
      cidadesMap.get(row.id as string) || [],
      semanasMap.get(row.id as string) || [],
      feedbackMap.get(row.id as string) || []
    )
  )
}

export const liderService = {
  async getAll(): Promise<Lider[]> {
    const result = await db.execute("SELECT id FROM lideres ORDER BY id")
    const ids = result.rows.map((r) => r.id as string)
    return loadLiderBatch(ids)
  },

  async getById(id: string): Promise<Lider | undefined> {
    const results = await db.batch([
      { sql: "SELECT * FROM lideres WHERE id = ?", args: [id] },
      { sql: "SELECT * FROM cidades WHERE liderId = ?", args: [id] },
      { sql: "SELECT * FROM semanas WHERE liderId = ? ORDER BY semana", args: [id] },
      { sql: "SELECT * FROM feedback_itens WHERE liderId = ?", args: [id] },
    ])
    if (results[0].rows.length === 0) return undefined
    return rowToLider(
      results[0].rows[0],
      results[1].rows.map(rowToCidade),
      results[2].rows.map(rowToSemana),
      results[3].rows.map(rowToFeedbackItem)
    )
  },

  async create(data: Omit<Lider, "id" | "cidades" | "semanas" | "classificacao" | "score" | "feedback" | "feedbackItens" | "status">): Promise<Lider> {
    const countResult = await db.execute("SELECT COUNT(*) as cnt FROM lideres")
    const nextIdx = (countResult.rows[0].cnt as number) + 1
    const newId = `L${String(nextIdx).padStart(3, "0")}`

    await db.execute({
      sql: `INSERT INTO lideres (id, nome, telefone, whatsApp, regiao, estado, status, mentorId, dataInicio, observacoes, classificacao, score, feedback, programStatus, dataInicioPrograma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId, data.nome, data.telefone, data.whatsApp, data.regiao,
        data.estado, "ativo", data.mentorId, data.dataInicio, data.observacoes,
        "prata", 0, "", "nao_iniciado", "",
      ],
    })

    const semanasIniciais = [
      { semana: 1, tipo: "diagnostico" },
      { semana: 2, tipo: "execucao" },
      { semana: 3, tipo: "recuperacao" },
      { semana: 4, tipo: "avaliacao" },
    ]
    const feedbackInicial = [
      { criterio: "Meta", peso: 30 },
      { criterio: "Comprometimento", peso: 20 },
      { criterio: "Execução", peso: 20 },
      { criterio: "Liderança", peso: 15 },
      { criterio: "Participação", peso: 10 },
      { criterio: "Resultado", peso: 5 },
    ]

    await db.batch([
      ...semanasIniciais.map((s) => ({
        sql: `INSERT INTO semanas (liderId, semana, tipo, objetivo, acoesPlanejadas, acoesExecutadas, dificuldades, observacoes, nota, concluida) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [newId, s.semana, s.tipo, "", "", "", "", "", 0, 0] as InValue[],
      })),
      ...feedbackInicial.map((f) => ({
        sql: `INSERT INTO feedback_itens (liderId, criterio, nota, peso) VALUES (?, ?, ?, ?)`,
        args: [newId, f.criterio, 0, f.peso] as InValue[],
      })),
    ])

    return (await this.getById(newId))!
  },

  async update(id: string, data: Partial<Lider>): Promise<Lider> {
    const existing = await this.getById(id)
    if (!existing) throw new Error("Líder não encontrado")

    const fields: string[] = []
    const args: InValue[] = []

    const updatable = [
      "nome", "telefone", "whatsApp", "regiao", "estado", "status",
      "mentorId", "dataInicio", "observacoes", "classificacao", "score",
      "feedback", "programStatus", "dataInicioPrograma",
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
        sql: `UPDATE lideres SET ${fields.join(", ")} WHERE id = ?`,
        args,
      })
    }

    return (await this.getById(id))!
  },

  async delete(id: string): Promise<void> {
    await db.batch([
      { sql: "DELETE FROM feedback_itens WHERE liderId = ?", args: [id] },
      { sql: "DELETE FROM semanas WHERE liderId = ?", args: [id] },
      { sql: "DELETE FROM cidades WHERE liderId = ?", args: [id] },
      { sql: "DELETE FROM lideres WHERE id = ?", args: [id] },
    ])
  },

  async addCidade(liderId: string, cidade: Omit<Cidade, "id">): Promise<Lider> {
    const lider = await this.getById(liderId)
    if (!lider) throw new Error("Líder não encontrado")
    const cidadeId = crypto.randomUUID()
    await db.execute({
      sql: `INSERT INTO cidades (id, liderId, nome, estado, motoristasAtivos, passageirosAtivos, corridas, faturamento, ticketMedio, metaCorridas, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        cidadeId, liderId, cidade.nome, cidade.estado,
        cidade.motoristasAtivos, cidade.passageirosAtivos, cidade.corridas,
        cidade.faturamento, cidade.ticketMedio, cidade.metaCorridas, cidade.observacoes,
      ],
    })
    return (await this.getById(liderId))!
  },

  async updateCidade(liderId: string, cidadeId: string, data: Partial<Cidade>): Promise<Lider> {
    const lider = await this.getById(liderId)
    if (!lider) throw new Error("Líder não encontrado")

    const fields: string[] = []
    const args: InValue[] = []

    const updatable = [
      "nome", "estado", "motoristasAtivos", "passageirosAtivos",
      "corridas", "faturamento", "ticketMedio", "metaCorridas", "observacoes",
    ] as const

    for (const key of updatable) {
      if (key in data) {
        fields.push(`${key} = ?`)
        args.push(data[key] as InValue)
      }
    }

    if (fields.length > 0) {
      args.push(cidadeId, liderId)
      await db.execute({
        sql: `UPDATE cidades SET ${fields.join(", ")} WHERE id = ? AND liderId = ?`,
        args,
      })
    }

    return (await this.getById(liderId))!
  },

  async deleteCidade(liderId: string, cidadeId: string): Promise<Lider> {
    await db.execute({
      sql: "DELETE FROM cidades WHERE id = ? AND liderId = ?",
      args: [cidadeId, liderId],
    })
    return (await this.getById(liderId))!
  },

  async updateSemana(liderId: string, semanaIdx: number, data: Partial<SemanaPrograma>): Promise<Lider> {
    const lider = await this.getById(liderId)
    if (!lider) throw new Error("Líder não encontrado")
    if (!lider.semanas[semanaIdx]) throw new Error("Semana não encontrada")

    const semanaNum = semanaIdx + 1
    const fields: string[] = []
    const args: InValue[] = []

    const updatable = ["objetivo", "acoesPlanejadas", "acoesExecutadas", "dificuldades", "observacoes", "nota", "concluida"] as const
    for (const key of updatable) {
      if (key in data) {
        const val = key === "concluida" ? ((data[key] as boolean) ? 1 : 0) : data[key]
        fields.push(`${key} = ?`)
        args.push(val as InValue)
      }
    }

    if (fields.length > 0) {
      args.push(liderId, semanaNum)
      await db.execute({
        sql: `UPDATE semanas SET ${fields.join(", ")} WHERE liderId = ? AND semana = ?`,
        args,
      })
    }

    const updatedLider = (await this.getById(liderId))!
    await recalcularScore(updatedLider)
    return (await this.getById(liderId))!
  },

  async startProgram(liderId: string): Promise<Lider> {
    const lider = await this.getById(liderId)
    if (!lider) throw new Error("Líder não encontrado")
    await db.execute({
      sql: "UPDATE lideres SET programStatus = ?, dataInicioPrograma = ? WHERE id = ?",
      args: ["semana_1", new Date().toISOString().split("T")[0], liderId],
    })
    return (await this.getById(liderId))!
  },

  async concludeWeek(liderId: string, semanaIdx: number): Promise<Lider> {
    const lider = await this.getById(liderId)
    if (!lider) throw new Error("Líder não encontrado")
    if (!lider.semanas[semanaIdx]) throw new Error("Semana não encontrada")

    const semanaNum = semanaIdx + 1
    await db.execute({
      sql: "UPDATE semanas SET concluida = 1 WHERE liderId = ? AND semana = ?",
      args: [liderId, semanaNum],
    })

    const nextStatus: Record<number, ProgramStatus> = {
      0: "semana_2",
      1: "semana_3",
      2: "semana_4",
      3: "finalizado",
    }
    await db.execute({
      sql: "UPDATE lideres SET programStatus = ? WHERE id = ?",
      args: [nextStatus[semanaIdx], liderId],
    })

    if (semanaIdx === 3) {
      const updatedLider = (await this.getById(liderId))!
      await recalcularScore(updatedLider)
    }

    return (await this.getById(liderId))!
  },

  async updateFeedbackItens(liderId: string, itens: FeedbackItem[]): Promise<Lider> {
    const lider = await this.getById(liderId)
    if (!lider) throw new Error("Líder não encontrado")

    await db.execute({
      sql: "DELETE FROM feedback_itens WHERE liderId = ?",
      args: [liderId],
    })

    await db.batch(
      itens.map((item) => ({
        sql: "INSERT INTO feedback_itens (liderId, criterio, nota, peso) VALUES (?, ?, ?, ?)",
        args: [liderId, item.criterio, item.nota, item.peso] as InValue[],
      }))
    )

    const score = calcularScore(itens)
    const classificacao = calcularClassificacao(score)
    const feedback = gerarFeedback(score, classificacao)
    const status = score >= 60 ? "ativo" : score >= 30 ? "recuperacao" : "inativo"

    await db.execute({
      sql: "UPDATE lideres SET score = ?, classificacao = ?, feedback = ?, status = ? WHERE id = ?",
      args: [score, classificacao, feedback, status, liderId],
    })

    return (await this.getById(liderId))!
  },
}

async function recalcularScore(lider: Lider): Promise<void> {
  const allNotas = lider.semanas.map((s) => s.nota)
  const avg =
    allNotas.filter((n) => n > 0).reduce((a, b) => a + b, 0) /
    Math.max(allNotas.filter((n) => n > 0).length, 1)

  const totalCorridasLider = lider.cidades.reduce((a, c) => a + c.corridas, 0)
  const metaScore =
    totalCorridasLider >= 300
      ? 100
      : Math.round((totalCorridasLider / 300) * 100)

  const feedbackItens = lider.feedbackItens.map((item) => {
    if (item.criterio === "Meta") return { ...item, nota: metaScore }
    if (item.criterio === "Execução") return { ...item, nota: Math.round(avg) }
    if (item.criterio === "Comprometimento")
      return { ...item, nota: Math.round(avg) }
    return item
  })

  await db.batch(
    feedbackItens.map((item) => ({
      sql: "UPDATE feedback_itens SET nota = ? WHERE liderId = ? AND criterio = ?",
      args: [item.nota, lider.id, item.criterio] as InValue[],
    }))
  )

  const score = calcularScore(feedbackItens)
  const classificacao = calcularClassificacao(score)
  const feedback = gerarFeedback(score, classificacao)
  const status = score >= 60 ? "ativo" : score >= 30 ? "recuperacao" : "inativo"

  await db.execute({
    sql: "UPDATE lideres SET score = ?, classificacao = ?, feedback = ?, status = ? WHERE id = ?",
    args: [score, classificacao, feedback, status, lider.id],
  })
}
