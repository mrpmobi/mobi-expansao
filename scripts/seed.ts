import { createClient, type InStatement } from "@libsql/client"
import { readFileSync } from "fs"
import { join } from "path"

const url = process.env.TURSO_DATABASE_URL || "file:local.db"
const authToken = process.env.TURSO_AUTH_TOKEN || undefined

const db = createClient({ url, authToken })

async function seed() {
  console.log("Connecting to database...")
  await db.execute("SELECT 1")

  console.log("Creating tables...")
  const schema = readFileSync(join(import.meta.dirname, "schema.sql"), "utf-8")
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  for (const stmt of statements) {
    await db.execute(stmt + ";")
  }

  console.log("Importing mock data...")
  const { diretores, corporativos, lideres, reunioes } = await import(
    "../src/mocks/data.ts"
  )

  const stmts: InStatement[] = []

  for (const d of diretores) {
    stmts.push({
      sql: "INSERT OR IGNORE INTO diretores (id, nome, email) VALUES (?, ?, ?)",
      args: [d.id, d.nome, d.email],
    })
  }

  for (const c of corporativos) {
    stmts.push({
      sql: "INSERT OR IGNORE INTO corporativos (id, nome, email, telefone, regiao) VALUES (?, ?, ?, ?, ?)",
      args: [c.id, c.nome, c.email, c.telefone, c.regiao],
    })
  }

  for (const l of lideres) {
    stmts.push({
      sql: `INSERT OR IGNORE INTO lideres (id, nome, telefone, whatsApp, regiao, estado, status, mentorId, dataInicio, observacoes, classificacao, score, feedback, programStatus, dataInicioPrograma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        l.id, l.nome, l.telefone, l.whatsApp, l.regiao, l.estado,
        l.status, l.mentorId, l.dataInicio, l.observacoes,
        l.classificacao, l.score, l.feedback, l.programStatus, l.dataInicioPrograma,
      ],
    })

    for (const c of l.cidades) {
      stmts.push({
        sql: `INSERT OR IGNORE INTO cidades (id, liderId, nome, estado, motoristasAtivos, passageirosAtivos, corridas, faturamento, ticketMedio, metaCorridas, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          c.id, l.id, c.nome, c.estado, c.motoristasAtivos,
          c.passageirosAtivos, c.corridas, c.faturamento,
          c.ticketMedio, c.metaCorridas, c.observacoes,
        ],
      })
    }

    for (const s of l.semanas) {
      stmts.push({
        sql: `INSERT OR IGNORE INTO semanas (liderId, semana, tipo, objetivo, acoesPlanejadas, acoesExecutadas, dificuldades, observacoes, nota, concluida) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          l.id, s.semana, s.tipo, s.objetivo, s.acoesPlanejadas,
          s.acoesExecutadas, s.dificuldades, s.observacoes, s.nota,
          s.concluida ? 1 : 0,
        ],
      })
    }

    for (const f of l.feedbackItens) {
      stmts.push({
        sql: `INSERT OR IGNORE INTO feedback_itens (liderId, criterio, nota, peso) VALUES (?, ?, ?, ?)`,
        args: [l.id, f.criterio, f.nota, f.peso],
      })
    }
  }

  for (const r of reunioes) {
    stmts.push({
      sql: `INSERT OR IGNORE INTO reunioes (id, semana, data, corporativoId, liderId, situacaoGeral, motoristas, passageiros, corridas, campanhas, visitas, reunioes, principaisDificuldades, planoProximaSemana) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        r.id, r.semana, r.data, r.corporativoId, r.liderId,
        r.situacaoGeral, r.motoristas, r.passageiros, r.corridas,
        r.campanhas, r.visitas, r.reunioes, r.principaisDificuldades,
        r.planoProximaSemana,
      ],
    })
  }

  console.log(`Executing ${stmts.length} statements via batch...`)
  await db.batch(stmts)

  console.log(`Seeded: ${diretores.length} diretores, ${corporativos.length} corporativos, ${lideres.length} lideres, ${reunioes.length} reunioes`)
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
