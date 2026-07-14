import { useMemo } from "react"
import {
  Users,
  Building2,
  MapPin,
  Car,
  DollarSign,
  Target,
  Trophy,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { StatCard } from "@/components/shared/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { formatCurrency, formatNumber } from "@/utils"

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
      const faturamento = lideres.reduce(
        (a, l) => a + l.cidades.reduce((b, c) => b + c.faturamento * (0.5 + idx * 0.15), 0),
        0
      )
      return { semana, corridas, faturamento }
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
          faturamento: lids.reduce((a, l) => a + l.cidades.reduce((b, ci) => b + ci.faturamento, 0), 0),
        }
      }),
    [lideres, corporativos]
  )

  const topLideres = useMemo(
    () =>
      [...lideres]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((l) => ({
          nome: l.nome,
          score: l.score,
          corridas: l.cidades.reduce((a, c) => a + c.corridas, 0),
        })),
    [lideres]
  )

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {p.name === "faturamento" ? formatCurrency(p.value) : formatNumber(p.value)}
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
          title="Corporativos"
          value={indicadores.totalCorporativos}
          icon={Building2}
          colorClass="bg-violet-500 text-white"
        />
        <StatCard
          title="Cidades"
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
          title="Faturamento Total"
          value={indicadores.totalFaturamento}
          type="currency"
          icon={DollarSign}
          colorClass="bg-green-500 text-white"
        />
        <StatCard
          title="Ticket Médio"
          value={indicadores.ticketMedio}
          type="currency"
          icon={TrendingUp}
          colorClass="bg-cyan-500 text-white"
        />
        <StatCard
          title="Meta Geral"
          value={indicadores.metaGeral}
          type="number"
          icon={Target}
          colorClass="bg-indigo-500 text-white"
        />
        <StatCard
          title="Percentual Atingido"
          value={indicadores.percentualAtingido}
          type="percent"
          icon={BarChart3}
          colorClass={
            indicadores.percentualAtingido >= 70
              ? "bg-emerald-500 text-white"
              : indicadores.percentualAtingido >= 40
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
          }
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoSemanal}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="semana" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={renderTooltip} />
                <Line type="monotone" dataKey="corridas" stroke="#3b82f6" name="Corridas" strokeWidth={2} />
                <Line type="monotone" dataKey="faturamento" stroke="#10b981" name="Faturamento" strokeWidth={2} />
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
            <CardTitle className="text-base">Top 10 Líderes</CardTitle>
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
                            width: `${l.score}%`,
                            backgroundColor:
                              l.score >= 70 ? "#059669" : l.score >= 40 ? "#d97706" : "#dc2626",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{l.score}%</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(l.corridas)} corridas
                    </p>
                  </div>
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
                <p className="text-2xl font-bold">{formatCurrency(indicadores.totalFaturamento)}</p>
                <p className="text-xs text-muted-foreground">Faturamento</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{formatNumber(indicadores.totalCorridas)}</p>
                <p className="text-xs text-muted-foreground">Corridas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
