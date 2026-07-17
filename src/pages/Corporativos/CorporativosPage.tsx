import { useMemo } from "react"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, MapPin, Car, Target, Trophy } from "lucide-react"
import { formatNumber } from "@/utils"

export function CorporativosPage() {
  const { lideres, corporativos } = useData()

  const dados = useMemo(
    () =>
      corporativos.map((c) => {
        const lids = lideres.filter((l) => l.mentorId === c.id)
        const totalCidades = lids.reduce((a, l) => a + l.cidades.length, 0)
        const totalCorridas = lids.reduce(
          (a, l) => a + l.cidades.reduce((b, ci) => b + ci.corridas, 0),
          0
        )
        const totalFaturamento = lids.reduce(
          (a, l) => a + l.cidades.reduce((b, ci) => b + ci.faturamento, 0),
          0
        )
        const metaGeral = lids.reduce(
          (a, l) => a + l.cidades.reduce((b, ci) => b + ci.metaCorridas, 0),
          0
        )
        const scoreMedio = lids.length > 0
          ? Math.round(lids.reduce((a, l) => a + l.score, 0) / lids.length)
          : 0
        const semanasConcluidas = lids.filter((l) =>
          l.semanas.every((s) => s.concluida)
        ).length
        const pendentes = lids.filter((l) =>
          l.semanas.some((s) => !s.concluida)
        ).length

        return {
          ...c,
          lids,
          totalLideres: lids.length,
          totalCidades,
          totalCorridas,
          totalFaturamento,
          metaGeral,
          scoreMedio,
          semanasConcluidas,
          pendentes,
        }
      }),
    [lideres, corporativos]
  )

  const colors = [
    { icon: "bg-blue-500", border: "border-blue-200 dark:border-blue-800", bg: "bg-blue-50 dark:bg-blue-950" },
    { icon: "bg-emerald-500", border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { icon: "bg-orange-500", border: "border-orange-200 dark:border-orange-800", bg: "bg-orange-50 dark:bg-orange-950" },
    { icon: "bg-violet-500", border: "border-violet-200 dark:border-violet-800", bg: "bg-violet-50 dark:bg-violet-950" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {dados.map((d, i) => (
          <Card key={d.id} className={`overflow-hidden border-l-4 ${colors[i % 4].border}`}>
            <CardHeader className={`pb-2 ${colors[i % 4].bg}`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${colors[i % 4].icon} text-white`}>
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">{d.nome}</CardTitle>
                  <p className="text-xs text-muted-foreground">{d.regiao}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Líderes</p>
                  <p className="font-semibold">{d.totalLideres}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Cidades</p>
                  <p className="font-semibold">{d.totalCidades}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Corridas</p>
                  <p className="font-semibold">{formatNumber(d.totalCorridas)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Score</p>
                  <p className="font-semibold">{d.scoreMedio}%</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Meta</span>
                  <span>
                    {formatNumber(d.totalCorridas)} / {formatNumber(d.metaGeral)}
                  </span>
                </div>
                <Progress
                  value={d.metaGeral > 0 ? (d.totalCorridas / d.metaGeral) * 100 : 0}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {dados.map((d) => (
        <Card key={d.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {d.nome}
              <Badge variant="secondary">{d.regiao}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Líder</TableHead>
                  <TableHead className="text-right">Cidades</TableHead>
                  <TableHead className="text-right">Corridas</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead>Semanas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.lids.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhum líder vinculado
                    </TableCell>
                  </TableRow>
                ) : (
                  [...d.lids]
                    .sort((a, b) => b.score - a.score)
                    .map((l) => {
                      const concluidas = l.semanas.filter((s) => s.concluida).length
                      const totalCorridas = l.cidades.reduce((a, c) => a + c.corridas, 0)
                      return (
                        <TableRow key={l.id}>
                          <TableCell className="font-medium">{l.nome}</TableCell>
                          <TableCell className="text-right">{l.cidades.length}</TableCell>
                          <TableCell className="text-right">{formatNumber(totalCorridas)}</TableCell>
                          <TableCell className="text-right">{l.score}%</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                l.classificacao === "ouro"
                                  ? "ouro"
                                  : l.classificacao === "prata"
                                    ? "prata"
                                    : "vermelho"
                              }
                            >
                              {l.classificacao}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-2 w-2 rounded-full ${
                                    l.semanas[i]?.concluida
                                      ? "bg-emerald-500"
                                      : "bg-muted"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground">{concluidas}/4</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
