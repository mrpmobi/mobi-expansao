export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul"
export type StatusLider = "ativo" | "inativo" | "recuperacao"
export type Classificacao = "ouro" | "prata" | "vermelho"
export type SemanaTipo = "diagnostico" | "execucao" | "recuperacao" | "avaliacao"
export type ProgramStatus = "nao_iniciado" | "semana_1" | "semana_2" | "semana_3" | "semana_4" | "finalizado"

export interface Diretor {
  id: string
  nome: string
  email: string
}

export interface Corporativo {
  id: string
  nome: string
  email: string
  telefone: string
  regiao: Regiao
}

export interface Cidade {
  id: string
  nome: string
  estado: string
  motoristasAtivos: number
  passageirosAtivos: number
  corridas: number
  faturamento: number
  ticketMedio: number
  metaCorridas: number
  observacoes: string
}

export interface SemanaPrograma {
  semana: number
  tipo: SemanaTipo
  objetivo: string
  acoesPlanejadas: string
  acoesExecutadas: string
  dificuldades: string
  observacoes: string
  nota: number
  concluida: boolean
}

export interface FeedbackItem {
  criterio: string
  nota: number
  peso: number
}

export interface Lider {
  id: string
  nome: string
  telefone: string
  whatsApp: string
  regiao: Regiao
  estado: string
  status: StatusLider
  mentorId: string
  dataInicio: string
  observacoes: string
  cidades: Cidade[]
  semanas: SemanaPrograma[]
  classificacao: Classificacao
  score: number
  feedback: string
  feedbackItens: FeedbackItem[]
  programStatus: ProgramStatus
  dataInicioPrograma: string
}

export interface Reuniao {
  id: string
  semana: number
  data: string
  corporativoId: string
  liderId: string
  situacaoGeral: string
  motoristas: number
  passageiros: number
  corridas: number
  campanhas: string
  visitas: number
  reunioes: number
  principaisDificuldades: string
  planoProximaSemana: string
}

export interface DashboardIndicadores {
  totalLideres: number
  totalCorporativos: number
  totalCidades: number
  totalCorridas: number
  lideresAtivos: number
  lideresEmPrograma: number
  lideresFinalizados: number
  metaPrograma: number
  lideresAcimaMeta: number
  lideresAbaixoMeta: number
  lideresOuro: number
  lideresPrata: number
  lideresVermelho: number
  lideresEmRisco: number
}
