import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatNumber } from "@/utils"

export function ReunioesPage() {
  const { reunioes, lideres, corporativos, addReuniao, updateReuniao, deleteReuniao } = useData()
  const [search, setSearch] = useState("")
  const [semanaFilter, setSemanaFilter] = useState<string>("todas")
  const [activeTab, setActiveTab] = useState("reunioes")
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    semana: 1,
    data: new Date().toISOString().split("T")[0],
    corporativoId: "",
    liderId: "",
    situacaoGeral: "",
    motoristas: 0,
    passageiros: 0,
    corridas: 0,
    campanhas: "",
    visitas: 0,
    reunioes: 0,
    principaisDificuldades: "",
    planoProximaSemana: "",
  })

  const filtered = useMemo(
    () =>
      reunioes.filter((r) => {
        const lider = lideres.find((l) => l.id === r.liderId)
        if (search && !(lider?.nome || "").toLowerCase().includes(search.toLowerCase()))
          return false
        if (semanaFilter !== "todas" && r.semana !== Number(semanaFilter)) return false
        return true
      }),
    [reunioes, lideres, search, semanaFilter]
  )

  const resumo = useMemo(() => {
    const total = filtered.length
    const totalCorridas = filtered.reduce((a, r) => a + r.corridas, 0)
    const totalMotoristas = filtered.reduce((a, r) => a + r.motoristas, 0)
    const totalPassageiros = filtered.reduce((a, r) => a + r.passageiros, 0)
    return { total, totalCorridas, totalMotoristas, totalPassageiros }
  }, [filtered])

  function resetForm() {
    setFormData({
      semana: 1,
      data: new Date().toISOString().split("T")[0],
      corporativoId: corporativos[0]?.id || "",
      liderId: lideres[0]?.id || "",
      situacaoGeral: "",
      motoristas: 0,
      passageiros: 0,
      corridas: 0,
      campanhas: "",
      visitas: 0,
      reunioes: 0,
      principaisDificuldades: "",
      planoProximaSemana: "",
    })
    setEditId(null)
  }

  async function handleSubmit() {
    if (editId) {
      await updateReuniao(editId, formData as any)
    } else {
      await addReuniao(formData as any)
    }
    resetForm()
  }

  function openEdit(r: (typeof reunioes)[0]) {
    setEditId(r.id)
    setFormData({
      semana: r.semana,
      data: r.data,
      corporativoId: r.corporativoId,
      liderId: r.liderId,
      situacaoGeral: r.situacaoGeral,
      motoristas: r.motoristas,
      passageiros: r.passageiros,
      corridas: r.corridas,
      campanhas: r.campanhas,
      visitas: r.visitas,
      reunioes: r.reunioes,
      principaisDificuldades: r.principaisDificuldades,
      planoProximaSemana: r.planoProximaSemana,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 w-full">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-1" /> Nova Reunião
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? "Editar Reunião" : "Nova Reunião"}</DialogTitle>
              <DialogDescription>
                Registre a prestação de contas semanal.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Semana</Label>
                  <Select
                    value={String(formData.semana)}
                    onValueChange={(v) => setFormData({ ...formData, semana: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((s) => (
                        <SelectItem key={s} value={String(s)}>Semana {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Corporativo</Label>
                  <Select
                    value={formData.corporativoId}
                    onValueChange={(v) => setFormData({ ...formData, corporativoId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {corporativos.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Líder</Label>
                <Select
                  value={formData.liderId}
                  onValueChange={(v) => setFormData({ ...formData, liderId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lideres.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Motoristas</Label>
                  <Input
                    type="number"
                    value={formData.motoristas}
                    onChange={(e) =>
                      setFormData({ ...formData, motoristas: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Passageiros</Label>
                  <Input
                    type="number"
                    value={formData.passageiros}
                    onChange={(e) =>
                      setFormData({ ...formData, passageiros: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Corridas</Label>
                  <Input
                    type="number"
                    value={formData.corridas}
                    onChange={(e) =>
                      setFormData({ ...formData, corridas: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visitas</Label>
                  <Input
                    type="number"
                    value={formData.visitas}
                    onChange={(e) =>
                      setFormData({ ...formData, visitas: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reuniões</Label>
                  <Input
                    type="number"
                    value={formData.reunioes}
                    onChange={(e) =>
                      setFormData({ ...formData, reunioes: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Situação Geral</Label>
                <Textarea
                  value={formData.situacaoGeral}
                  onChange={(e) =>
                    setFormData({ ...formData, situacaoGeral: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Campanhas</Label>
                <Textarea
                  value={formData.campanhas}
                  onChange={(e) =>
                    setFormData({ ...formData, campanhas: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Principais Dificuldades</Label>
                  <Textarea
                    value={formData.principaisDificuldades}
                    onChange={(e) =>
                      setFormData({ ...formData, principaisDificuldades: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plano Próxima Semana</Label>
                  <Textarea
                    value={formData.planoProximaSemana}
                    onChange={(e) =>
                      setFormData({ ...formData, planoProximaSemana: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button onClick={handleSubmit}>
                {editId ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const lider = lideres.find((l) => l.id === r.liderId)
                    const corp = corporativos.find((c) => c.id === r.corporativoId)
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Badge variant="secondary">S{r.semana}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(r.data).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {lider?.nome || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          {corp?.nome || "-"}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatNumber(r.corridas)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          <Badge
                            variant={
                              r.situacaoGeral.toLowerCase().includes("satisf")
                                ? "default"
                                : "prata"
                            }
                          >
                            {r.situacaoGeral}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => openEdit(r)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
