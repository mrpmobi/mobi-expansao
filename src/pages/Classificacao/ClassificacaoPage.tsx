import { useState, useMemo } from "react"
import { Search, Trophy, Medal, ArrowUp, ArrowDown, Target } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { formatNumber } from "@/utils"

export function ClassificacaoPage() {
  const { lideres, corporativos } = useData()
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState<string>("todas")
  const [selectedLider, setSelectedLider] = useState<typeof lideres[0] | null>(null)

  const ranking = useMemo(
    () =>
      [...lideres]
        .filter((l) => {
          if (search && !l.nome.toLowerCase().includes(search.toLowerCase())) return false
          if (classFilter !== "todas" && l.classificacao !== classFilter) return false
          return true
        })
        .sort((a, b) => {
          const corridasA = a.cidades.reduce((s, c) => s + c.corridas, 0)
          const corridasB = b.cidades.reduce((s, c) => s + c.corridas, 0)
          if (corridasB !== corridasA) return corridasB - corridasA
          return b.score - a.score
        })
        .map((l, idx) => ({ ...l, pos: idx + 1 })),
    [lideres, search, classFilter]
  )

  const stats = useMemo(() => {
    const total = lideres.length
    const ouro = lideres.filter((l) => l.classificacao === "ouro").length
    const prata = lideres.filter((l) => l.classificacao === "prata").length
    const vermelho = lideres.filter((l) => l.classificacao === "vermelho").length
    return { total, ouro, prata, vermelho, pctOuro: (ouro / total) * 100, pctPrata: (prata / total) * 100, pctVermelho: (vermelho / total) * 100 }
  }, [lideres])

  const classIcon = (cls: string) => {
    if (cls === "ouro") return <Trophy className="h-4 w-4 text-emerald-600" />
    if (cls === "prata") return <Medal className="h-4 w-4 text-yellow-600" />
    return <ArrowDown className="h-4 w-4 text-red-600" />
  }

  const getSugestao = (lider: typeof lideres[0]) => {
    if (lider.classificacao === "ouro") return "Continuar / Assumir novas cidades"
    if (lider.classificacao === "prata") return "Recuperação"
    return "Substituir"
  }

  const getIniciais = (nome: string) =>
    nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="overflow-hidden border-l-4 border-l-emerald-500 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950">
          <CardContent className="p-4 text-center">
            <div className="rounded-lg p-2 bg-emerald-500 text-white w-fit mx-auto mb-2">
              <Trophy className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.ouro}</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Ouro ({stats.pctOuro.toFixed(0)}%)</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-l-4 border-l-yellow-500 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="p-4 text-center">
            <div className="rounded-lg p-2 bg-yellow-500 text-white w-fit mx-auto mb-2">
              <Medal className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.prata}</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Prata ({stats.pctPrata.toFixed(0)}%)</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-l-4 border-l-red-500 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
          <CardContent className="p-4 text-center">
            <div className="rounded-lg p-2 bg-red-500 text-white w-fit mx-auto mb-2">
              <ArrowDown className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.vermelho}</p>
            <p className="text-sm text-red-600 dark:text-red-400">Vermelho ({stats.pctVermelho.toFixed(0)}%)</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar líder..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Classificação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="ouro">Ouro</SelectItem>
            <SelectItem value="prata">Prata</SelectItem>
            <SelectItem value="vermelho">Vermelho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ranking de Líderes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Líder</TableHead>
                <TableHead className="hidden md:table-cell">Mentor</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Corridas</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Meta 300</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead className="hidden md:table-cell">Sugestão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((lider) => {
                const mentor = corporativos.find((c) => c.id === lider.mentorId)
                const totalCorridas = lider.cidades.reduce((a, c) => a + c.corridas, 0)
                return (
                  <TableRow
                    key={lider.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedLider(lider)}
                  >
                    <TableCell className="font-bold text-lg">
                      {lider.pos <= 3 ? classIcon(lider.classificacao) : lider.pos}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getIniciais(lider.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{lider.nome}</p>
                          <p className="text-xs text-muted-foreground">{lider.regiao}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {mentor?.nome || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold">{lider.score}%</span>
                        <Progress
                          value={lider.score}
                          className="w-16 h-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right text-sm">
                      {formatNumber(totalCorridas)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right">
                      {(() => {
                        const pct = totalCorridas >= 300 ? 100 : Math.round((totalCorridas / 300) * 100)
                        return (
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, backgroundColor: totalCorridas >= 300 ? "#059669" : "#d97706" }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${totalCorridas >= 300 ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                              {pct}%
                            </span>
                          </div>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lider.classificacao === "ouro"
                            ? "ouro"
                            : lider.classificacao === "prata"
                              ? "prata"
                              : "vermelho"
                        }
                      >
                        {lider.classificacao}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {getSugestao(lider)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedLider}
        onOpenChange={(o) => !o && setSelectedLider(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          {selectedLider && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedLider.nome}
                  <Badge
                    variant={
                      selectedLider.classificacao === "ouro"
                        ? "ouro"
                        : selectedLider.classificacao === "prata"
                          ? "prata"
                          : "vermelho"
                    }
                  >
                    {selectedLider.classificacao}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Score: {selectedLider.score}/100 | Sugestão:{" "}
                  {getSugestao(selectedLider)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Critérios de Avaliação</h4>
                  <div className="grid gap-2">
                    {selectedLider.feedbackItens.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm w-36">{item.criterio}</span>
                        <div className="flex-1">
                          <Progress value={item.nota} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {item.nota}
                        </span>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          peso {item.peso}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Feedback Automático</h4>
                  <div className="p-3 bg-muted rounded-lg text-sm leading-relaxed">
                    {selectedLider.feedback}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Cidades</h4>
                    <p className="text-2xl font-bold">{selectedLider.cidades.length}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Corridas</h4>
                    <p className="text-2xl font-bold">
                      {formatNumber(
                        selectedLider.cidades.reduce((a, c) => a + c.corridas, 0)
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Meta 300 corridas</h4>
                    {(() => {
                      const total = selectedLider.cidades.reduce((a, c) => a + c.corridas, 0)
                      const atingiu = total >= 300
                      const pct = atingiu ? 100 : Math.round((total / 300) * 100)
                      return (
                        <>
                          <p className="text-2xl font-bold">{formatNumber(total)}</p>
                          <Progress value={pct} className="h-2 mt-1" />
                          <p className={`text-xs mt-1 ${atingiu ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                            {atingiu ? "Meta atingida!" : `${pct}% da meta`}
                          </p>
                        </>
                      )
                    })()}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Semanas Concluídas</h4>
                    <p className="text-2xl font-bold">
                      {selectedLider.semanas.filter((s) => s.concluida).length}/4
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
