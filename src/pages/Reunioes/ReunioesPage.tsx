import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { EmptyState } from "@/components/shared/EmptyState"
import { formatNumber } from "@/utils"

export function ReunioesPage() {
  const { lideres, corporativos } = useData()
  const [search, setSearch] = useState("")
  const [semanaFilter, setSemanaFilter] = useState<string>("todas")

  const reunioesDerivadas = useMemo(() => {
    const result: Array<{
      id: string
      semana: number
      data: string
      liderId: string
      liderNome: string
      corporativoId: string
      corporativoNome: string
      situacaoGeral: string
      motoristas: number
      passageiros: number
      corridas: number
      campanhas: string
      visitas: number
      reunioes: number
      principaisDificuldades: string
      planoProximaSemana: string
    }> = []

    for (const lider of lideres) {
      if (lider.programStatus === "nao_iniciado" || !lider.dataInicioPrograma) continue

      const dataInicio = new Date(lider.dataInicioPrograma)
      const totalMotoristas = lider.cidades.reduce((a, c) => a + c.motoristasAtivos, 0)
      const totalPassageiros = lider.cidades.reduce((a, c) => a + c.passageirosAtivos, 0)
      const totalCorridas = lider.cidades.reduce((a, c) => a + c.corridas, 0)
      const mentor = corporativos.find((c) => c.id === lider.mentorId)

      for (const semana of lider.semanas) {
        const dataSemana = new Date(dataInicio)
        dataSemana.setDate(dataSemana.getDate() + (semana.semana - 1) * 7)

        result.push({
          id: `${lider.id}-S${semana.semana}`,
          semana: semana.semana,
          data: dataSemana.toISOString().split("T")[0],
          liderId: lider.id,
          liderNome: lider.nome,
          corporativoId: lider.mentorId,
          corporativoNome: mentor?.nome || "-",
          situacaoGeral: semana.observacoes || "Sem observações registradas",
          motoristas: totalMotoristas,
          passageiros: totalPassageiros,
          corridas: totalCorridas,
          campanhas: semana.acoesExecutadas || "Nenhuma campanha registrada",
          visitas: 0,
          reunioes: semana.concluida ? 1 : 0,
          principaisDificuldades: semana.dificuldades || "Nenhuma dificuldade registrada",
          planoProximaSemana: semana.objetivo || "Nenhum plano registrado",
        })
      }
    }

    return result
  }, [lideres, corporativos])

  const filtered = useMemo(
    () =>
      reunioesDerivadas.filter((r) => {
        if (search && !r.liderNome.toLowerCase().includes(search.toLowerCase()))
          return false
        if (semanaFilter !== "todas" && r.semana !== Number(semanaFilter)) return false
        return true
      }),
    [reunioesDerivadas, search, semanaFilter]
  )

  const resumo = useMemo(() => {
    const total = filtered.length
    const totalCorridas = filtered.reduce((a, r) => a + r.corridas, 0)
    const totalMotoristas = filtered.reduce((a, r) => a + r.motoristas, 0)
    const totalPassageiros = filtered.reduce((a, r) => a + r.passageiros, 0)
    return { total, totalCorridas, totalMotoristas, totalPassageiros }
  }, [filtered])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar reuniões..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={semanaFilter} onValueChange={setSemanaFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semana" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {[1, 2, 3, 4].map((s) => (
              <SelectItem key={s} value={String(s)}>Semana {s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumo das Reuniões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{resumo.total}</p>
              <p className="text-xs text-muted-foreground">Reuniões</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(resumo.totalMotoristas)}</p>
              <p className="text-xs text-muted-foreground">Motoristas</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(resumo.totalPassageiros)}</p>
              <p className="text-xs text-muted-foreground">Passageiros</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(resumo.totalCorridas)}</p>
              <p className="text-xs text-muted-foreground">Corridas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Registros ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState title="Nenhuma reunião encontrada" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semana</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Líder</TableHead>
                    <TableHead className="hidden md:table-cell">Corporativo</TableHead>
                    <TableHead className="text-right">Corridas</TableHead>
                    <TableHead className="hidden sm:table-cell">Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Badge variant="secondary">S{r.semana}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(r.data).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {r.liderNome}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {r.corporativoNome}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatNumber(r.corridas)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm max-w-[200px]">
                        <span className="line-clamp-2 text-muted-foreground">
                          {r.situacaoGeral}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
