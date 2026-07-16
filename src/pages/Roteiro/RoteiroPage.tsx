import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClipboardCheck,
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  BookOpen,
} from "lucide-react"

const semanas = [
  {
    value: "s1",
    numero: 1,
    titulo: "Diagnóstico e Organização",
    cor: "bg-blue-500",
    badge: "blue",
    objetivo:
      "Compreender a realidade das cidades e construir um plano de ação estruturado.",
    atividades: [
      "Reunião de alinhamento com o líder",
      "Análise dos indicadores atuais (corridas, motoristas, passageiros, faturamento)",
      "Levantamento de dificuldades e gargalos",
      "Definição das metas da semana",
      "Planejamento das ações comerciais",
      "Organização da agenda de visitas",
    ],
    resultado:
      "O representante inicia a execução com objetivos claros e cronograma definido.",
    icon: ClipboardCheck,
  },
  {
    value: "s2",
    numero: 2,
    titulo: "Execução Intensiva",
    cor: "bg-emerald-500",
    badge: "default",
    objetivo: "Colocar o plano em prática com acompanhamento próximo do corporativo.",
    atividades: [
      "Crescimento das corridas",
      "Novas campanhas",
      "Visitas realizadas",
      "Empresas visitadas",
      "Evolução dos passageiros",
      "Evolução dos motoristas",
    ],
    alerta:
      "Caso os resultados estejam abaixo do esperado, será emitido um alerta e definidos ajustes imediatos.",
    resultado:
      "Execução ativa com monitoramento constante para correção de rota.",
    icon: TrendingUp,
  },
  {
    value: "s3",
    numero: 3,
    titulo: "Recuperação ou Aceleração",
    cor: "bg-orange-500",
    badge: "prata",
    objetivo: "Eliminar gargalos e atuar diretamente nas dificuldades identificadas.",
    atividades: [
      "Obstáculos encontrados",
      "Desempenho das campanhas",
      "Produtividade da região",
      "Necessidade de apoio adicional",
    ],
    resultado:
      "Ao final da semana será elaborado um plano de recuperação (para quem estiver abaixo da meta) ou um plano de aceleração (para quem estiver acima).",
    icon: Target,
  },
  {
    value: "s4",
    numero: 4,
    titulo: "Avaliação Final",
    cor: "bg-violet-500",
    badge: "ouro",
    objetivo: "Análise completa do ciclo de 30 dias.",
    atividades: [
      "Meta de corridas",
      "Comprometimento",
      "Execução das ações",
      "Evolução da região",
      "Capacidade de liderança",
    ],
    resultado:
      "Com base nesses resultados será tomada uma decisão sobre o futuro do líder no programa.",
    icon: Award,
  },
]

const papeis = [
  {
    nome: "Direção",
    descricao: "Acompanha o programa de forma executiva. Visualiza dashboards, evolução geral, ranking e prestação de contas. Não opera o sistema diretamente.",
    acoes: ["Dashboard geral", "Evolução dos líderes", "Classificação", "Relatórios"],
  },
  {
    nome: "Corporativo",
    descricao: "Principal operador do programa. Acompanha líderes, registra informações semanais, avalia desempenho e toma decisões.",
    acoes: ["Acompanhar líderes", "Registrar semanas", "Avaliar classificação", "Prestar contas em reuniões"],
  },
  {
    nome: "Líder de Expansão",
    descricao: "Responsável pelas cidades. Executa o plano comercial e reporta resultados ao corporativo.",
    acoes: ["Executar ações nas cidades", "Reportar resultados", "Participar das reuniões"],
  },
]

function SemanaCard({ semana }: { semana: (typeof semanas)[0] }) {
  const Icon = semana.icon
  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: semana.cor.replace("bg-", "").replace("-500", "") === "blue" ? "#3b82f6" : semana.cor.replace("bg-", "").replace("-500", "") === "emerald" ? "#10b981" : semana.cor.replace("bg-", "").replace("-500", "") === "orange" ? "#f59e0b" : "#8b5cf6" }}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`rounded-lg p-3 ${semana.cor} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant={semana.badge as any}>Semana {semana.numero}</Badge>
              <CardTitle className="text-lg">{semana.titulo}</CardTitle>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{semana.objetivo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
            <ListChecks className="h-4 w-4 text-muted-foreground" />
            Atividades
          </h4>
          <ul className="space-y-1.5">
            {semana.atividades.map((atv, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <ChevronRight className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <span>{atv}</span>
              </li>
            ))}
          </ul>
        </div>

        {"alerta" in semana && semana.alerta && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">{semana.alerta}</p>
          </div>
        )}

        <Separator />

        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Resultado esperado</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{semana.resultado}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RoteiroPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 border-violet-200 dark:border-violet-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-violet-500 p-3 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Programa de Expansão Mobi</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Roteiro completo para o Corporativo acompanhar o desenvolvimento dos Líderes de Expansão durante os 30 dias do programa.
              </p>
              <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Badge variant="default" className="h-2 w-2 p-0 rounded-full" /> 4 semanas
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="ouro" className="h-2 w-2 p-0 rounded-full" /> Diagnóstico
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" /> Execução
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="default" className="h-2 w-2 p-0 rounded-full" /> Avaliação
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {papeis.map((papel) => (
          <Card key={papel.nome}>
            <CardHeader>
              <CardTitle className="text-sm">{papel.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{papel.descricao}</p>
              <ul className="space-y-1">
                {papel.acoes.map((acao, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    {acao}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="s1">
        <TabsList className="w-full justify-start overflow-x-auto">
          {semanas.map((s) => (
            <TabsTrigger key={s.value} value={s.value} className="text-xs gap-1">
              <span className={`h-2 w-2 rounded-full ${s.cor}`} />
              Semana {s.numero}
            </TabsTrigger>
          ))}
        </TabsList>
        {semanas.map((s) => (
          <TabsContent key={s.value} value={s.value} className="mt-4">
            <SemanaCard semana={s} />
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Fluxo de Operação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Navegação no Sistema</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0 mt-0.5">1</span>
                  <span>Acesse <strong>Líderes</strong> para visualizar e gerenciar todos os líderes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0 mt-0.5">2</span>
                  <span>Em <strong>Programa de 4 Semanas</strong>, selecione um líder e preencha cada semana</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0 mt-0.5">3</span>
                  <span>Registre as <strong>Reuniões</strong> semanais de prestação de contas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0 mt-0.5">4</span>
                  <span>A <strong>Classificação</strong> é calculada automaticamente com base nos dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0 mt-0.5">5</span>
                  <span>Use o <strong>Dashboard</strong> e <strong>Relatórios</strong> para acompanhar a evolução</span>
                </li>
              </ol>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Critérios de Classificação</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                  <Badge variant="ouro">Ouro</Badge>
                  <span className="text-sm text-emerald-700 dark:text-emerald-400">Score ≥ 70 — Continuar / Novas cidades</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                  <Badge variant="prata">Prata</Badge>
                  <span className="text-sm text-yellow-700 dark:text-yellow-400">Score ≥ 40 — Programa de recuperação</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <Badge variant="vermelho">Vermelho</Badge>
                  <span className="text-sm text-red-700 dark:text-red-400">Score {'<'} 40 — Avaliar substituição</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                O score é calculado automaticamente considerando: Meta (30%), Comprometimento (20%), Execução (20%), Liderança (15%), Participação (10%) e Resultado (5%).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
