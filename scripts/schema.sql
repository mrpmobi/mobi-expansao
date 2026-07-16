CREATE TABLE IF NOT EXISTS diretores (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS corporativos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  regiao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lideres (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  whatsApp TEXT NOT NULL,
  regiao TEXT NOT NULL,
  estado TEXT NOT NULL,
  status TEXT NOT NULL,
  mentorId TEXT NOT NULL,
  dataInicio TEXT NOT NULL,
  observacoes TEXT NOT NULL,
  classificacao TEXT NOT NULL,
  score INTEGER NOT NULL,
  feedback TEXT NOT NULL,
  programStatus TEXT NOT NULL,
  dataInicioPrograma TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cidades (
  id TEXT PRIMARY KEY,
  liderId TEXT NOT NULL,
  nome TEXT NOT NULL,
  estado TEXT NOT NULL,
  motoristasAtivos INTEGER NOT NULL,
  passageirosAtivos INTEGER NOT NULL,
  corridas INTEGER NOT NULL,
  faturamento REAL NOT NULL,
  ticketMedio REAL NOT NULL,
  metaCorridas INTEGER NOT NULL,
  observacoes TEXT NOT NULL,
  FOREIGN KEY (liderId) REFERENCES lideres(id)
);

CREATE TABLE IF NOT EXISTS semanas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  liderId TEXT NOT NULL,
  semana INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  acoesPlanejadas TEXT NOT NULL,
  acoesExecutadas TEXT NOT NULL,
  dificuldades TEXT NOT NULL,
  observacoes TEXT NOT NULL,
  nota INTEGER NOT NULL,
  concluida INTEGER NOT NULL,
  FOREIGN KEY (liderId) REFERENCES lideres(id)
);

CREATE TABLE IF NOT EXISTS feedback_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  liderId TEXT NOT NULL,
  criterio TEXT NOT NULL,
  nota INTEGER NOT NULL,
  peso INTEGER NOT NULL,
  FOREIGN KEY (liderId) REFERENCES lideres(id)
);

CREATE TABLE IF NOT EXISTS reunioes (
  id TEXT PRIMARY KEY,
  semana INTEGER NOT NULL,
  data TEXT NOT NULL,
  corporativoId TEXT NOT NULL,
  liderId TEXT NOT NULL,
  situacaoGeral TEXT NOT NULL,
  motoristas INTEGER NOT NULL,
  passageiros INTEGER NOT NULL,
  corridas INTEGER NOT NULL,
  campanhas TEXT NOT NULL,
  visitas INTEGER NOT NULL,
  reunioes INTEGER NOT NULL,
  principaisDificuldades TEXT NOT NULL,
  planoProximaSemana TEXT NOT NULL
);
