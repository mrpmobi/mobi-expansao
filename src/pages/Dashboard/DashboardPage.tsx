import { useMemo } from "react"
import {
  Users,
  Building2,
  MapPin,
  Car,
  Trophy,
  BarChart3,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Award,
} from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { StatCard } from "@/components/shared/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { formatNumber } from "@/utils"

const COLORS = {
  ouro: "#059669",
  prata: "#d97706",
  vermelho: "#dc2626",
}

export function DashboardPage() {
  const { lideres, corporativos, indicadores } = useData()

  const evolucaoSemanal = useMemo(() => {
    const semanas = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"]
    return semanas.map((semana, idx) => {
      const corridas = lideres.reduce(
        (a, l) => a + l.cidades.reduce((b, c) => b + Math.round(c.corridas * (0.5 + idx * 0.15)), 0),
        0
      )
      return { semana, corridas }
    })
  }, [lideres])

  const dadosClassificacao = useMemo(
    () => [
      { name: "Ouro", value: indicadores?.lideresOuro || 0, color: COLORS.ouro },
      { name: "Prata", value: indicadores?.lideresPrata || 0, color: COLORS.prata },
      { name: "Vermelho", value: indicadores?.lideresVermelho || 0, color: COLORS.vermelho },
    ],
    [indicadores]
  )

  const dadosPorCorporativo = useMemo(
    () =>
      corporativos.map((c) => {
        const lids = lideres.filter((l) => l.mentorId === c.id)
        return {
          nome: c.nome.split(" ")[0],
          corridas: lids.reduce((a, l) => a + l.cidades.reduce((b, ci) => b + ci.corridas, 0), 0),
        }
      }),
    [lideres, corporativos]
  )

  const topLideres = useMemo(
    () =>
      [...lideres]
        .sort((a, b) => {
          const corridasA = a.cidades.reduce((s, c) => s + c.corridas, 0)
          const corridasB = b.cidades.reduce((s, c) => s + c.corridas, 0)
          return corridasB - corridasA
        })
        .slice(0, 10)
        .map((l) => {
          const total = l.cidades.reduce((a, c) => a + c.corridas, 0)
          return {
            nome: l.nome,
            corridas: total,
            metaAtingida: total >= 300,
            pct: Math.min(Math.round((total / 300) * 100), 100),
          }
        }),
    [lideres]
  )

  const topCidades = useMemo(
    () =>
      [...lideres]
        .flatMap((l) => l.cidades.map((c) => ({ nome: `${c.nome}/${c.estado}`, corridas: c.corridas, lider: l.nome })))
        .sort((a, b) => b.corridas - a.corridas)
        .slice(0, 10),
    [lideres]
  )

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {formatNumber(p.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!indicadores) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Líderes"
          value={indicadores.totalLideres}
          icon={Users}
          colorClass="bg-blue-500 text-white"
        />
        <StatCard
          title="Líderes c/ Meta Atingida"
          value={indicadores.lideresAcimaMeta}
          icon={Award}
          colorClass="bg-emerald-500 text-white"
        />
        <StatCard
          title="Líderes em Programa"
          value={indicadores.lideresEmPrograma}
          icon={PlayCircle}
          colorClass="bg-violet-500 text-white"
        />
        <StatCard
          title="Líderes Finalizados"
          value={indicadores.lideresFinalizados}
          icon={CheckCircle2}
          colorClass="bg-cyan-500 text-white"
        />
        <StatCard
          title="Total de Cidades"
          value={indicadores.totalCidades}
          icon={MapPin}
          colorClass="bg-emerald-500 text-white"
        />
        <StatCard
          title="Total de Corridas"
          value={indicadores.totalCorridas}
          icon={Car}
          colorClass="bg-orange-500 text-white"
        />
        <StatCard
          title="Corporativos"
          value={indicadores.totalCorporativos}
          icon={Building2}
          colorClass="bg-violet-500 text-white"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Status do Programa</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            <div className="text-center p-2 rounded-lg bg-gray-50 border">
              <p className="text-lg font-bold text-gray-500">{lideres.filter((l) => l.programStatus === "nao_iniciado").length}</p>
              <p className="text-[10px] text-gray-500 truncate">Não iniciado</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-lg font-bold text-blue-600">{lideres.filter((l) => l.programStatus === "semana_1").length}</p>
              <p className="text-[10px] text-blue-600 truncate">Semana 1</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-lg font-bold text-yellow-600">{lideres.filter((l) => l.programStatus === "semana_2").length}</p>
              <p className="text-[10px] text-yellow-600 truncate">Semana 2</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-lg font-bold text-orange-600">{lideres.filter((l) => l.programStatus === "semana_3").length}</p>
              <p className="text-[10px] text-orange-600 truncate">Semana 3</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-violet-50 border border-violet-200">
              <p className="text-lg font-bold text-violet-600">{lideres.filter((l) => l.programStatus === "semana_4").length}</p>
              <p className="text-[10px] text-violet-600 truncate">Semana 4</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-lg font-bold text-emerald-600">{lideres.filter((l) => l.programStatus === "finalizado").length}</p>
              <p className="text-[10px] text-emerald-600 truncate">Finalizado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução Semanal de Corridas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoSemanal}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="semana" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={renderTooltip} />
                <Line type="monotone" dataKey="corridas" stroke="#3b82f6" name="Corridas" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classificação dos Líderes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosClassificacao}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dadosClassificacao.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Corridas por Corporativo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosPorCorporativo}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="nome" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={renderTooltip} />
                <Bar dataKey="corridas" fill="#8b5cf6" name="Corridas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 Líderes por Corridas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLideres.map((l, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    {idx + 1}º
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{l.nome}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${l.pct}%`,
                            backgroundColor: l.metaAtingida ? "#059669" : "#d97706",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatNumber(l.corridas)}</p>
                    <p className={`text-xs ${l.metaAtingida ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {l.pct}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Meta 300 Corridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-600">{indicadores.lideresAcimaMeta}</p>
                <p className="text-xs text-emerald-700">Acima da meta</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-2xl font-bold text-red-600">{indicadores.lideresAbaixoMeta}</p>
                <p className="text-xs text-red-700">Abaixo da meta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 Cidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCidades.map((c, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-5">{idx + 1}º</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{c.nome}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{c.lider}</p>
                  </div>
                  <span className="text-sm font-medium">{formatNumber(c.corridas)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Resumo Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{indicadores.lideresOuro}</p>
                <p className="text-xs text-muted-foreground">Ouro</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{indicadores.lideresPrata}</p>
                <p className="text-xs text-muted-foreground">Prata</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{indicadores.lideresVermelho}</p>
                <p className="text-xs text-muted-foreground">Vermelho</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{indicadores.lideresEmRisco}</p>
                <p className="text-xs text-muted-foreground">Em Risco</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatNumber(indicadores.totalCorridas)}</p>
                <p className="text-xs text-muted-foreground">Corridas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatNumber(indicadores.metaPrograma)}</p>
                <p className="text-xs text-muted-foreground">Meta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
