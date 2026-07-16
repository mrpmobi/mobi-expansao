import { useMemo } from "react"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber } from "@/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const COLORS = {
  ouro: "#059669",
  prata: "#d97706",
  vermelho: "#dc2626",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  emerald: "#10b981",
  orange: "#f59e0b",
}

export function RelatoriosPage() {
  const { lideres, corporativos } = useData()

  const evolucaoSemanal = useMemo(
    () =>
      ["Semana 1", "Semana 2", "Semana 3", "Semana 4"].map((semana, idx) => {
        const corridas = lideres.reduce(
          (a, l) =>
            a + l.cidades.reduce((b, c) => b + Math.round(c.corridas * (0.5 + idx * 0.15)), 0),
          0
        )
        return { semana, corridas }
      }),
    [lideres]
  )

  const dadosClassificacao = useMemo(
    () => [
      { name: "Ouro", value: lideres.filter((l) => l.classificacao === "ouro").length, color: COLORS.ouro },
      { name: "Prata", value: lideres.filter((l) => l.classificacao === "prata").length, color: COLORS.prata },
      { name: "Vermelho", value: lideres.filter((l) => l.classificacao === "vermelho").length, color: COLORS.vermelho },
    ],
    [lideres]
  )

  const dadosPorRegiao = useMemo(() => {
    const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]
    return regioes.map((regiao) => {
      const lids = lideres.filter((l) => l.regiao === regiao)
      return {
        regiao,
        lideres: lids.length,
        corridas: lids.reduce((a, l) => a + l.cidades.reduce((b, c) => b + c.corridas, 0), 0),
      }
    })
  }, [lideres])

  const dadosPorCorporativo = useMemo(
    () =>
      corporativos.map((c) => {
        const lids = lideres.filter((l) => l.mentorId === c.id)
        return {
          nome: c.nome.split(" ")[0],
          lideres: lids.length,
          scoreMedio: lids.length > 0
            ? Math.round(lids.reduce((a, l) => a + l.score, 0) / lids.length)
            : 0,
          corridas: lids.reduce((a, l) => a + l.cidades.reduce((b, ci) => b + ci.corridas, 0), 0),
        }
      }),
    [lideres, corporativos]
  )

  const totalCorridas = lideres.reduce((a, l) => a + l.cidades.reduce((b, c) => b + c.corridas, 0), 0)

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{formatNumber(totalCorridas)}</p>
            <p className="text-xs text-muted-foreground">Total de Corridas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{lideres.length}</p>
            <p className="text-xs text-muted-foreground">Total de Líderes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{lideres.reduce((a, l) => a + l.cidades.length, 0)}</p>
            <p className="text-xs text-muted-foreground">Total de Cidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-600">{lideres.filter((l) => l.programStatus === "finalizado").length}</p>
            <p className="text-xs text-muted-foreground">Programas Finalizados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evolucao">
        <TabsList>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="classificacao">Classificação</TabsTrigger>
          <TabsTrigger value="regiao">Por Região</TabsTrigger>
          <TabsTrigger value="corporativo">Por Corporativo</TabsTrigger>
        </TabsList>

        <TabsContent value="evolucao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolução Semanal de Corridas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={evolucaoSemanal}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip content={renderTooltip} />
                  <Line type="monotone" dataKey="corridas" stroke={COLORS.blue} name="Corridas" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classificacao" className="mt-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição</CardTitle>
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
                <CardTitle className="text-base">Detalhamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dadosClassificacao.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.value} líderes</span>
                    </div>
                    <Progress
                      value={(item.value / Math.max(...dadosClassificacao.map((d) => d.value), 1)) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regiao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Corridas por Região</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dadosPorRegiao}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="regiao" />
                  <YAxis />
                  <Tooltip content={renderTooltip} />
                  <Bar dataKey="corridas" fill={COLORS.blue} name="Corridas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporativo" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Desempenho por Corporativo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dadosPorCorporativo}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip content={renderTooltip} />
                  <Bar dataKey="corridas" fill={COLORS.violet} name="Corridas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking de Corporativos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-muted-foreground">Corporativo</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Líderes</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Score Médio</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Corridas</th>
                </tr>
              </thead>
              <tbody>
                {dadosPorCorporativo.map((d, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-medium">{d.nome}</td>
                    <td className="p-3 text-right">{d.lideres}</td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-medium ${
                          d.scoreMedio >= 70
                            ? "text-emerald-600"
                            : d.scoreMedio >= 40
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {d.scoreMedio}%
                      </span>
                    </td>
                    <td className="p-3 text-right">{formatNumber(d.corridas)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
