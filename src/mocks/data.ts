import type {
  Diretor,
  Corporativo,
  Lider,
  Reuniao,
  Cidade,
  SemanaPrograma,
  FeedbackItem,
  Classificacao,
  Regiao,
  ProgramStatus,
} from "@/types"

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals = 2): number {
  const val = Math.random() * (max - min) + min
  return Number(val.toFixed(decimals))
}

function getRegiao(estado: string): Regiao {
  const map: Record<string, Regiao> = {
    SP: "Sudeste", RJ: "Sudeste", MG: "Sudeste", ES: "Sudeste",
    BA: "Nordeste", PE: "Nordeste", MA: "Nordeste", SE: "Nordeste",
    RN: "Nordeste", PB: "Nordeste", AL: "Nordeste", CE: "Nordeste", PI: "Nordeste",
    PA: "Norte", AP: "Norte", AM: "Norte", AC: "Norte", RO: "Norte", RR: "Norte", TO: "Norte",
    GO: "Centro-Oeste", DF: "Centro-Oeste", MT: "Centro-Oeste", MS: "Centro-Oeste",
    PR: "Sul", SC: "Sul", RS: "Sul",
  }
  return map[estado] || "Sudeste"
}

function generateCidadeReal(nome: string, estado: string): Cidade {
  return {
    id: crypto.randomUUID(),
    nome,
    estado,
    motoristasAtivos: 0,
    passageirosAtivos: 0,
    corridas: 0,
    faturamento: 0,
    ticketMedio: 0,
    metaCorridas: 300,
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
    }),
    { motoristas: 0, passageiros: 0, corridas: 0 }
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
  { id: "C001", nome: "Fábio Lopes", email: "fabio@mobi.com", telefone: "(11) 99888-0001", regiao: "Sudeste" },
  { id: "C002", nome: "Fernanda Camargo", email: "fernanda@mobi.com", telefone: "(11) 99888-0002", regiao: "Nordeste" },
  { id: "C003", nome: "Mônica Pugliese", email: "monica@mobi.com", telefone: "(11) 99888-0003", regiao: "Sul" },
  { id: "C004", nome: "Guilherme Magnani", email: "guilherme@mobi.com", telefone: "(11) 99888-0004", regiao: "Norte" },
]

interface LiderRaw {
  nome: string
  estado: string
  telefone: string
  email: string
  cidades: string[]
}

const lideresRaw: LiderRaw[] = [
  { nome: "Sandoval Rodrigues Bastos", estado: "SP", telefone: "+5511987365019", email: "sandoval.rb@hotmail.com", cidades: ["Taboão da Serra", "Embu das Artes", "Itapecerica da Serra", "Cotia", "Osasco", "Itapevi", "Barueri"] },
  { nome: "Felipe Carvalho da Silva", estado: "RJ", telefone: "+5524988500454", email: "felipecar1977@gmail.com", cidades: ["Barra Mansa", "Volta Redonda", "Resende", "Pinheiral", "Porto Real", "Quatis", "Penedo", "Itatiaia", "Barra do Piraí", "Piraí", "Rio Claro"] },
  { nome: "Ana Paula Pereira Martins Ribeiro", estado: "SP", telefone: "+5511937316275", email: "paulagr.martins@gmail.com", cidades: ["Itapevi", "Jandira", "Barueri", "Carapicuíba", "Cotia", "Osasco"] },
  { nome: "Jerbialdo Silva Campos", estado: "BA", telefone: "+5577991123618", email: "jerbialdo@gmail.com", cidades: ["Vitória da Conquista"] },
  { nome: "Isaías de Jesus Silva", estado: "SP", telefone: "+5512992034031", email: "isaiasdejesus2910@gmail.com", cidades: ["Bauru", "Pederneiras", "Agudos", "Piratininga", "Cabrália Paulista", "Duartina", "Arealva", "Iacanga", "Botucatu", "Jaú"] },
  { nome: "Agnalda Aparecida Ferreira Alves", estado: "MG", telefone: "+5537988224265", email: "agnalda.fa@gmail.com", cidades: ["Divinópolis"] },
  { nome: "Ranilson Alves de Medeiros", estado: "PE", telefone: "+5581981230577", email: "medeirosranilson@gmail.com", cidades: ["Recife", "Olinda", "Jaboatão dos Guararapes", "Paulista", "Camaragibe", "São Lourenço da Mata", "Abreu e Lima", "Igarassu"] },
  { nome: "Francisco de Souza Junior", estado: "SP", telefone: "+5511994146748", email: "franciscodesouzajr@gmail.com", cidades: ["São Paulo", "Guarulhos", "Santa Isabel", "Mairiporã", "Francisco Morato", "Franco da Rocha", "Caieiras"] },
  { nome: "Horlando Macedo da Silva", estado: "MA", telefone: "+5599999332590", email: "horlandomacedo@gmail.com", cidades: ["Imperatriz", "João Lisboa", "Davinópolis", "Governador Edison Lobão", "São Miguel do Tocantins"] },
  { nome: "Juliano dos Santos Valentim", estado: "AP", telefone: "+5596991450345", email: "julianobelloc@gmail.com", cidades: ["Macapá", "Santana"] },
  { nome: "Fernanda Maria Camargo", estado: "SP", telefone: "+5511969032447", email: "f.camargo03@yahoo.com.br", cidades: ["Taboão da Serra", "Cotia"] },
  { nome: "Edsom Daniel Nunes", estado: "SP", telefone: "+5512982058090", email: "nedsom488@gmail.com", cidades: ["Jacareí", "São José dos Campos", "Salesópolis", "Caçapava", "Tremembé", "Pindamonhangaba", "Potim", "Roseira", "Aparecida", "Guaratinguetá", "Lorena", "Cachoeira Paulista", "Cruzeiro", "Lavrinhas", "Taubaté", "Santa Branca", "Guararema", "São Francisco Xavier", "Monteiro Lobato"] },
  { nome: "Silvio Silveira", estado: "SP", telefone: "+5512981811108", email: "silveiras1972@gmail.com", cidades: ["Jacareí"] },
  { nome: "Dorismar Soares de Jesus", estado: "MG", telefone: "+5538999342088", email: "dorismarsoaresj@yahoo.com", cidades: ["Montes Claros"] },
  { nome: "Wesley Antunes Batista", estado: "MG", telefone: "+553499096265", email: "mrpmobibh@gmail.com", cidades: ["Belo Horizonte"] },
  { nome: "Fabiano Martins da Silva", estado: "RJ", telefone: "+5521996171017", email: "binhomartinsfabiano89@gmail.com", cidades: ["Rio de Janeiro"] },
  { nome: "Anderson Alberto Salles", estado: "SP", telefone: "+5511957217861", email: "companysalles@gmail.com", cidades: ["Embu das Artes"] },
  { nome: "José Lopes dos Santos", estado: "SP", telefone: "+5512982880883", email: "joselopesterapeuta@gmail.com", cidades: ["Jacareí", "São José dos Campos", "Caçapava", "Taubaté", "Pindamonhangaba", "Aparecida", "Santa Branca", "Guararema", "Lorena", "Litoral Norte Paulista"] },
  { nome: "Elizeu Elias Maria da Silva", estado: "SP", telefone: "+5516993764317", email: "eliasamakhaparis2019@gmail.com", cidades: ["São Carlos", "Araraquara", "Rio Claro", "Jaú", "Pirassununga", "Brotas"] },
  { nome: "Decio Cabral Junior", estado: "SP", telefone: "+5511949291529", email: "deciojr.consultoria@gmail.com", cidades: ["Santo André", "São Caetano do Sul", "São Bernardo do Campo", "Diadema"] },
  { nome: "Ronald José Ferreira Martins", estado: "SP", telefone: "+5511964196017", email: "martinsronald128@gmail.com", cidades: ["São Bernardo do Campo"] },
  { nome: "Jefferson Lucas", estado: "RJ", telefone: "+5521987569431", email: "jeffersonlucas971@gmail.com", cidades: ["Rio de Janeiro", "Niterói", "São Gonçalo", "Itaboraí", "Maricá", "Magé", "Tanguá", "Rio Bonito"] },
  { nome: "Eliane Cristina Alves Santana", estado: "SP", telefone: "+5511985529982", email: "elianealves0810@gmail.com", cidades: ["Guarulhos", "Arujá", "Mairiporã", "Santa Isabel", "Nazaré Paulista", "Atibaia"] },
  { nome: "Silas Vargas", estado: "RJ", telefone: "+5521964633349", email: "silas.14vargas@gmail.com", cidades: ["Rio de Janeiro", "Duque de Caxias", "Nova Iguaçu"] },
  { nome: "João dos Santos Fiuza da Silva", estado: "MG", telefone: "+5538999134615", email: "agenciaviajerealizeseusonho@gmail.com", cidades: ["Montes Claros"] },
  { nome: "Rikhel Pereira dos Santos Chalu Pacheco", estado: "PA", telefone: "+5591984530583", email: "kelsantos1971@gmail.com", cidades: ["Ananindeua", "Belém", "Marituba", "Benevides"] },
  { nome: "Raimundo Jonas Fernandes Leitão", estado: "AC", telefone: "+5568999843620", email: "rjfernandesleitao@gmail.com", cidades: ["Rio Branco"] },
  { nome: "Maycon Soares Oliveira", estado: "GO", telefone: "+5562991763423", email: "networkmayconnovo@gmail.com", cidades: ["São Luís de Montes Belos", "Hidrolina", "Itapaci", "Rubiataba", "Carmo do Rio Verde", "Ceres", "Rialma", "Nova Glória", "Santa Isabel", "Goianésia", "Santa Rita do Novo Destino", "Barro Alto", "Uruaçu"] },
  { nome: "Edson José Dill", estado: "PR", telefone: "+5545991035007", email: "edsonjosedill@gmail.com", cidades: ["Cascavel"] },
  { nome: "Vinícius Souza das Neves Soares", estado: "RJ", telefone: "+5521966908299", email: "vinicius.souza.n.soares2016@gmail.com", cidades: ["Rio de Janeiro"] },
  { nome: "Yony Abelardo Malpartida Tacza", estado: "RJ", telefone: "+5521980579242", email: "yonyabelardo@gmail.com", cidades: ["Rio de Janeiro", "Niterói", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "São João de Meriti", "Belford Roxo", "Nilópolis", "Mesquita", "Queimados", "Itaguaí", "Maricá", "Itaboraí"] },
  { nome: "Janilson da Costa Fontes", estado: "MA", telefone: "+5599991744753", email: "rockman_janilson@hotmail.com", cidades: ["Imperatriz", "João Lisboa", "Açailândia", "Amarante", "Porto Franco", "Governador Edison Lobão", "Estreito", "Buritirana", "Cidelândia"] },
  { nome: "Filemom Auzier de Souza", estado: "SP", telefone: "+5511942233612", email: "filemom.auzier@gmail.com", cidades: ["São Paulo", "Guarulhos", "Mairiporã", "Caieiras", "Franco da Rocha", "Francisco Morato", "Santa Isabel", "Arujá", "Itaquaquecetuba", "Ferraz de Vasconcelos"] },
  { nome: "Aldemir Ferreira Neto", estado: "RN", telefone: "+5584986469131", email: "aldemirneto1976@gmail.com", cidades: ["Santa Cruz", "Natal"] },
  { nome: "Jucilene Lisboa de Farias Silva", estado: "SP", telefone: "+5511947508529", email: "jucilene.farias9252@gmail.com", cidades: ["Osasco", "Zona Oeste de São Paulo"] },
  { nome: "Monica Pugliese", estado: "SP", telefone: "+5511999831575", email: "mnicaphs@gmail.com", cidades: ["Rio Pequeno"] },
  { nome: "Carlos Henrique de Mello", estado: "MG", telefone: "+5534984054276", email: "carlosmellomrp@gmail.com", cidades: ["Uberaba", "Uberlândia", "Delta", "Veríssimo", "Conquista", "Campo Florido", "Sacramento"] },
  { nome: "Givaldo Alves Ribeiro", estado: "SE", telefone: "+5579996451768", email: "givaldoalvesribeiro21@gmail.com", cidades: ["Aracaju", "Barra dos Coqueiros", "Nossa Senhora do Socorro", "São Cristóvão", "Laranjeiras", "Lagarto", "Estância", "Itabaiana"] },
  { nome: "Marcelo José dos Santos", estado: "SP", telefone: "+5511987778467", email: "msconsultor.mobi@gmail.com", cidades: ["São Paulo"] },
  { nome: "Reuber Neves Gaspar", estado: "MG", telefone: "+5531991091201", email: "orientadorvip@gmail.com", cidades: ["Pirapama", "Jequitibá", "Baldim", "Prudente de Morais", "Matozinhos", "Pedro Leopoldo", "Belo Horizonte", "Curvelo", "Paraopeba", "Caetanópolis", "Inhaúma", "Cachoeira da Prata", "Fortuna de Minas", "Papagaios"] },
  { nome: "Gildásio de Jesus Silva", estado: "SP", telefone: "+5511931492288", email: "gsylva23@gmail.com", cidades: ["Zona Norte de São Paulo", "Zona Sul de São Paulo", "Zona Leste de São Paulo", "Guarulhos"] },
]

const lideres: Lider[] = lideresRaw.map((raw, idx) => {
  const mentorIndex = idx % corporativos.length
  const mentor = corporativos[mentorIndex]
  const regiao = getRegiao(raw.estado)
  const cidades = raw.cidades.map((nome) => generateCidadeReal(nome, raw.estado))
  const semanas: SemanaPrograma[] = [
    { semana: 1, tipo: "diagnostico", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
    { semana: 2, tipo: "execucao", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
    { semana: 3, tipo: "recuperacao", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
    { semana: 4, tipo: "avaliacao", objetivo: "", acoesPlanejadas: "", acoesExecutadas: "", dificuldades: "", observacoes: "", nota: 0, concluida: false },
  ]

  const lider: Lider = {
    id: `L${String(idx + 1).padStart(3, "0")}`,
    nome: raw.nome,
    telefone: raw.telefone,
    whatsApp: raw.telefone,
    regiao,
    estado: raw.estado,
    status: "ativo",
    mentorId: mentor.id,
    dataInicio: new Date(Date.now() - randomInt(1, 60) * 86400000).toISOString().split("T")[0],
    observacoes: `Email: ${raw.email}`,
    cidades,
    semanas,
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

  return lider
})

export { lideres }

export const reunioes: Reuniao[] = []
lideres.forEach((lider) => {
  for (let s = 1; s <= 4; s++) {
    const corporativo = corporativos.find((c) => c.id === lider.mentorId)!
    reunioes.push(generateReuniao(reunioes.length + 1, lider, corporativo, s))
  }
})
