import type {
  Diretor,
  Corporativo,
  Lider,
  Reuniao,
  Cidade,
  SemanaPrograma,
  FeedbackItem,
  Classificacao,
} from "@/types"

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const

const cidadesPorEstado: Record<string, string[]> = {
  SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos", "Bauru", "Piracicaba"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu", "Campos dos Goytacazes"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Montes Claros", "Divinópolis"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Ilhéus", "Barreiras"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Santa Maria", "Novo Hamburgo"],
  PE: ["Recife", "Olinda", "Caruaru", "Petrolina", "Paulista"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Sobral"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
  DF: ["Brasília", "Taguatinga", "Ceilândia", "Águas Claras"],
  AM: ["Manaus", "Parintins", "Itacoatiara"],
  ES: ["Vitória", "Vila Velha", "Cariacica", "Serra"],
  MA: ["São Luís", "Imperatriz", "Timon"],
  RN: ["Natal", "Mossoró", "Parnamirim"],
  PB: ["João Pessoa", "Campina Grande", "Patos"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas"],
  AL: ["Maceió", "Arapiraca", "Rio Largo"],
  PI: ["Teresina", "Parnaíba", "Picos"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto"],
  TO: ["Palmas", "Araguaína", "Gurupi"],
  AP: ["Macapá", "Santana", "Laranjal do Jari"],
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí"],
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals = 2): number {
  const val = Math.random() * (max - min) + min
  return Number(val.toFixed(decimals))
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateCidade(estado: string): Cidade {
  const motoristas = randomInt(10, 80)
  const passageiros = randomInt(50, 400)
  const corridas = randomInt(200, 3000)
  const faturamento = randomFloat(15000, 180000)
  const ticketMedio = corridas > 0 ? Number((faturamento / corridas).toFixed(2)) : 0
  return {
    id: crypto.randomUUID(),
    nome: pickRandom(cidadesPorEstado[estado] || ["Cidade Desconhecida"]),
    estado,
    motoristasAtivos: motoristas,
    passageirosAtivos: passageiros,
    corridas,
    faturamento,
    ticketMedio,
    metaCorridas: randomInt(500, 4000),
    observacoes: "",
  }
}

function gerarFeedbackItens(): FeedbackItem[] {
  return [
    { criterio: "Meta", nota: randomInt(0, 100), peso: 30 },
    { criterio: "Comprometimento", nota: randomInt(0, 100), peso: 20 },
    { criterio: "Execução", nota: randomInt(0, 100), peso: 20 },
    { criterio: "Liderança", nota: randomInt(0, 100), peso: 15 },
    { criterio: "Participação", nota: randomInt(0, 100), peso: 10 },
    { criterio: "Resultado", nota: randomInt(0, 100), peso: 5 },
  ]
}

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
  const partes: string[] = [
    "Pelas informações registradas durante as quatro semanas,",
  ]

  if (score >= 70) {
    partes.push("o líder apresentou excelente comprometimento, boa evolução nas cidades,")
    partes.push(`atingiu ${score}% da meta e demonstrou capacidade de liderança.`)
    partes.push(
      classificacao === "ouro"
        ? "Recomendação: classificação Ouro e expansão para novas cidades."
        : "Recomendação: manter o ritmo e buscar melhoria contínua."
    )
  } else if (score >= 40) {
    partes.push("o líder apresentou desempenho moderado, com alguns pontos de atenção,")
    partes.push(`atingiu ${score}% da meta.`)
    partes.push("Recomendação: programa de recuperação com foco em execução e liderança.")
  } else {
    partes.push("o líder apresentou baixo desempenho durante o programa,")
    partes.push(`atingiu apenas ${score}% da meta.`)
    partes.push("Recomendação: avaliação de substituição ou realocação.")
  }

  return partes.join(" ")
}

function gerarSemana(
  semana: number,
  tipo: SemanaPrograma["tipo"]
): SemanaPrograma {
  return {
    semana,
    tipo,
    objetivo: `Objetivo da ${tipo}`,
    acoesPlanejadas: `Ações planejadas para a semana ${semana}`,
    acoesExecutadas: `Ações executadas na semana ${semana}`,
    dificuldades: randomInt(0, 1) ? "Dificuldades encontradas" : "",
    observacoes: `Observações da semana ${semana}`,
    nota: randomInt(0, 100),
    concluida: semana < 4 ? randomInt(0, 1) === 1 : true,
  }
}

const nomesLideres = [
  "Ana Beatriz Santos", "Carlos Eduardo Oliveira", "Daniela Cristina Lima",
  "Eduardo Henrique Costa", "Fernanda Maria Souza", "Gabriel Almeida Silva",
  "Helena Patricia Ferreira", "Igor Vinicius Barbosa", "Julia Carolina Ribeiro",
  "Lucas Gabriel Martins", "Mariana Oliveira Costa", "Nicolas Augusto Pereira",
  "Olivia Fernanda Alves", "Pedro Henrique Carvalho", "Rafaela Cristina Souza",
  "Samuel Teixeira Lima", "Tatiane Oliveira Santos", "Ulysses Fernando Gomes",
  "Vanessa Cristina Barbosa", "Wellington Luiz Costa", "Alexandre Pereira Filho",
  "Bianca Rodrigues Silva", "Caio Cesar Oliveira", "Débora Cristina Martins",
  "Eliane Aparecida Souza", "Felipe Augusto Lima", "Gabriela Nogueira Costa",
  "Humberto Cesar Santos", "Isabela Cristina Alves", "João Pedro Carvalho",
  "Karen Priscila Oliveira", "Leonardo Henrique Silva", "Michele Aparecida Costa",
  "Nathan Felipe Barbosa", "Priscila Cristina Lima", "Rafael Henrique Souza",
  "Sabrina Oliveira Costa", "Thiago Augusto Alves", "Ursula Cristina Pereira",
  "Valmir Henrique Martins", "Wesley Gabriel Santos", "Yasmin Cristina Barbosa",
  "Adriano Cesar Lima", "Bruna Carolina Oliveira", "Cristiane Aparecida Silva",
  "Diego Henrique Costa", "Evelyn Cristina Souza", "Fabio Augusto Alves",
  "Gisele Nogueira Martins", "Hugo Gabriel Pereira",
]

function generateLider(
  id: number,
  corporativos: Corporativo[]
): Lider {
  const mentor = pickRandom(corporativos)
  const estado = pickRandom(estados)
  const numCidades = randomInt(3, 8)
  const cidades: Cidade[] = []
  for (let i = 0; i < numCidades; i++) {
    cidades.push(generateCidade(estado))
  }

  const feedbackItens = gerarFeedbackItens()
  const score = calcularScore(feedbackItens)
  const classificacao = calcularClassificacao(score)

  const semanas: SemanaPrograma[] = [
    gerarSemana(1, "diagnostico"),
    gerarSemana(2, "execucao"),
    gerarSemana(3, "recuperacao"),
    gerarSemana(4, "avaliacao"),
  ]

  return {
    id: `L${String(id).padStart(3, "0")}`,
    nome: nomesLideres[id - 1] || `Líder ${id}`,
    telefone: `(11) 9${String(randomInt(1000, 9999))}-${String(randomInt(1000, 9999))}`,
    whatsApp: `(11) 9${String(randomInt(1000, 9999))}-${String(randomInt(1000, 9999))}`,
    regiao: mentor.regiao,
    estado,
    status: score >= 60 ? "ativo" : score >= 30 ? "recuperacao" : "inativo",
    mentorId: mentor.id,
    dataInicio: new Date(Date.now() - randomInt(1, 60) * 86400000).toISOString().split("T")[0],
    observacoes: "",
    cidades,
    semanas,
    classificacao,
    score,
    feedback: gerarFeedback(score, classificacao),
    feedbackItens,
  }
}

function generateReuniao(
  id: number,
  lider: Lider,
  corporativo: Corporativo,
  semana: number
): Reuniao {
  const totalCidades = lider.cidades.reduce(
    (acc, c) => ({
      motoristas: acc.motoristas + c.motoristasAtivos,
      passageiros: acc.passageiros + c.passageirosAtivos,
      corridas: acc.corridas + c.corridas,
      faturamento: acc.faturamento + c.faturamento,
    }),
    { motoristas: 0, passageiros: 0, corridas: 0, faturamento: 0 }
  )

  return {
    id: `R${String(id).padStart(3, "0")}`,
    semana,
    data: new Date(Date.now() - (4 - semana) * 7 * 86400000).toISOString().split("T")[0],
    corporativoId: corporativo.id,
    liderId: lider.id,
    situacaoGeral: randomInt(0, 1) ? "Satisfatória" : "Precisa de atenção",
    motoristas: totalCidades.motoristas,
    passageiros: totalCidades.passageiros,
    corridas: totalCidades.corridas,
    faturamento: totalCidades.faturamento,
    ticketMedio:
      totalCidades.corridas > 0
        ? Number((totalCidades.faturamento / totalCidades.corridas).toFixed(2))
        : 0,
    campanhas: "Campanhas realizadas na semana",
    visitas: randomInt(0, 20),
    reunioes: randomInt(1, 5),
    principaisDificuldades: randomInt(0, 1)
      ? "Dificuldades operacionais"
      : "Nenhuma dificuldade relevante",
    planoProximaSemana: "Continuar execução do plano de expansão",
  }
}

export const diretores: Diretor[] = [
  { id: "D001", nome: "Carlos Alberto Mendes", email: "carlos@mobi.com" },
  { id: "D002", nome: "Patrícia Oliveira Lima", email: "patricia@mobi.com" },
]

export const corporativos: Corporativo[] = [
  { id: "C001", nome: "Fábio Lopes", email: "andre@mobi.com", telefone: "(11) 99888-0001", regiao: "Sudeste" },
  { id: "C002", nome: "Fernanda Camargo", email: "beatriz@mobi.com", telefone: "(11) 99888-0002", regiao: "Nordeste" },
  { id: "C003", nome: "Mônica Pugliese", email: "marcos@mobi.com", telefone: "(11) 99888-0003", regiao: "Sul" },
  { id: "C004", nome: "Guilherme Magnani", email: "renata@mobi.com", telefone: "(11) 99888-0004", regiao: "Norte" },
]

export const lideres: Lider[] = Array.from({ length: 50 }, (_, i) =>
  generateLider(i + 1, corporativos)
)

export const reunioes: Reuniao[] = []
lideres.forEach((lider, idx) => {
  for (let s = 1; s <= 4; s++) {
    const corporativo = corporativos.find((c) => c.id === lider.mentorId)!
    reunioes.push(generateReuniao(reunioes.length + 1, lider, corporativo, s))
  }
})
