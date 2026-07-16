import { useState, useMemo } from "react"
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  PlayCircle,
  Circle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatNumber } from "@/utils"
import type { Regiao, ProgramStatus } from "@/types"

const regioes: Regiao[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]

const programStatusMeta: Record<ProgramStatus, { label: string; color: string; icon: typeof Circle }> = {
  nao_iniciado: { label: "Não iniciado", color: "text-gray-400 bg-gray-50 border-gray-200", icon: Circle },
  semana_1: { label: "Semana 1", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Clock },
  semana_2: { label: "Semana 2", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  semana_3: { label: "Semana 3", color: "text-orange-600 bg-orange-50 border-orange-200", icon: Clock },
  semana_4: { label: "Semana 4", color: "text-violet-600 bg-violet-50 border-violet-200", icon: Clock },
  finalizado: { label: "Finalizado", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
}

const programSteps: ProgramStatus[] = ["nao_iniciado", "semana_1", "semana_2", "semana_3", "semana_4", "finalizado"]

export function LideresPage() {
  const { lideres, corporativos, addLider, updateLider, deleteLider, startProgram } = useData()
  const [search, setSearch] = useState("")
  const [regiaoFilter, setRegiaoFilter] = useState<string>("todas")
  const [programFilter, setProgramFilter] = useState<string>("todos")
  const [mentorFilter, setMentorFilter] = useState<string>("todos")
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    whatsApp: "",
    estado: "",
    regiao: "" as Regiao | "",
    mentorId: "",
    dataInicio: new Date().toISOString().split("T")[0],
    observacoes: "",
  })

  const filtered = useMemo(
    () =>
      lideres.filter((l) => {
        if (search && !l.nome.toLowerCase().includes(search.toLowerCase())) return false
        if (regiaoFilter !== "todas" && l.regiao !== regiaoFilter) return false
        if (programFilter !== "todos" && l.programStatus !== programFilter) return false
        if (mentorFilter !== "todos" && l.mentorId !== mentorFilter) return false
        return true
      }),
    [lideres, search, regiaoFilter, programFilter, mentorFilter]
  )

  function resetForm() {
    setFormData({
      nome: "",
      telefone: "",
      whatsApp: "",
      estado: "",
      regiao: "",
      mentorId: "",
      dataInicio: new Date().toISOString().split("T")[0],
      observacoes: "",
    })
    setEditId(null)
  }

  async function handleSubmit() {
    if (editId) {
      await updateLider(editId, formData as any)
    } else {
      await addLider(formData as any)
    }
    resetForm()
  }

  function openEdit(lider: (typeof lideres)[0]) {
    setEditId(lider.id)
    setFormData({
      nome: lider.nome,
      telefone: lider.telefone,
      whatsApp: lider.whatsApp,
      estado: lider.estado,
      regiao: lider.regiao,
      mentorId: lider.mentorId,
      dataInicio: lider.dataInicio,
      observacoes: lider.observacoes,
    })
  }

  async function confirmDelete() {
    if (deleteId) {
      await deleteLider(deleteId)
      setDeleteId(null)
    }
  }

  const classBadge = (cls: string) => {
    const map: Record<string, string> = {
      ouro: "ouro",
      prata: "prata",
      vermelho: "vermelho",
    }
    return (
      <Badge variant={(map[cls] || "secondary") as any}>
        {cls.charAt(0).toUpperCase() + cls.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar líder..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={regiaoFilter} onValueChange={setRegiaoFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {regioes.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Programa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="nao_iniciado">Não iniciado</SelectItem>
              <SelectItem value="semana_1">Semana 1</SelectItem>
              <SelectItem value="semana_2">Semana 2</SelectItem>
              <SelectItem value="semana_3">Semana 3</SelectItem>
              <SelectItem value="semana_4">Semana 4</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={mentorFilter} onValueChange={setMentorFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Mentor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {corporativos.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-1" /> Novo Líder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? "Editar Líder" : "Novo Líder"}</DialogTitle>
              <DialogDescription>
                Preencha os dados do líder de expansão.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.whatsApp}
                    onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Região</Label>
                  <Select
                    value={formData.regiao}
                    onValueChange={(v) => setFormData({ ...formData, regiao: v as Regiao })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {regioes.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mentor</Label>
                  <Select
                    value={formData.mentorId}
                    onValueChange={(v) => setFormData({ ...formData, mentorId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
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
          <CardTitle className="text-base flex items-center justify-between">
            <span>Líderes ({filtered.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState title="Nenhum líder encontrado" description="Tente ajustar os filtros." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Região</TableHead>
                  <TableHead className="hidden md:table-cell">Mentor</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead className="hidden lg:table-cell">Meta 300</TableHead>
                  <TableHead className="hidden lg:table-cell">Cidades</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lider) => {
                  const mentor = corporativos.find((c) => c.id === lider.mentorId)
                  const ps = programStatusMeta[lider.programStatus]
                  const stepIdx = programSteps.indexOf(lider.programStatus)
                  const PsIcon = ps.icon
                  return (
                    <TableRow key={lider.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lider.nome}</p>
                          <p className="text-xs text-muted-foreground">{lider.estado}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{lider.regiao}</TableCell>
                      <TableCell className="hidden md:table-cell">{mentor?.nome || "-"}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${ps.color}`}>
                              <PsIcon className="h-3.5 w-3.5" />
                              {ps.label}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[450px]">
                            <DialogHeader>
                              <DialogTitle className="text-base">{lider.nome}</DialogTitle>
                              <DialogDescription>Timeline do programa</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="relative">
                                {programSteps.map((step, i) => {
                                  const meta = programStatusMeta[step]
                                  const StIcon = meta.icon
                                  const isCurrent = i === stepIdx
                                  const isPast = i < stepIdx
                                  return (
                                    <div key={step} className="flex items-start gap-3 pb-5 last:pb-0 relative">
                                      <div className="flex flex-col items-center">
                                        <div
                                          className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold
                                            ${isCurrent ? "border-blue-500 bg-blue-500 text-white" : ""}
                                            ${isPast ? "border-emerald-500 bg-emerald-500 text-white" : ""}
                                            ${!isCurrent && !isPast ? "border-gray-300 bg-white text-gray-400" : ""}
                                          `}
                                        >
                                          <StIcon className="h-3.5 w-3.5" />
                                        </div>
                                        {i < programSteps.length - 1 && (
                                          <div
                                            className={`absolute top-7 w-0.5 h-5 ${isPast ? "bg-emerald-400" : "bg-gray-200"}`}
                                          />
                                        )}
                                      </div>
                                      <div className="pt-1">
                                        <p className={`text-sm font-medium ${isCurrent ? "text-blue-600" : isPast ? "text-emerald-600" : "text-gray-400"}`}>
                                          {meta.label}
                                        </p>
                                        {isCurrent && lider.programStatus !== "finalizado" && lider.programStatus !== "nao_iniciado" && (
                                          <p className="text-xs text-muted-foreground">Em andamento</p>
                                        )}
                                        {isCurrent && lider.programStatus === "nao_iniciado" && (
                                          <p className="text-xs text-muted-foreground">Aguardando início</p>
                                        )}
                                        {isCurrent && lider.programStatus === "finalizado" && (
                                          <p className="text-xs text-muted-foreground">Programa concluído</p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {(() => {
                          const total = lider.cidades.reduce((a, c) => a + c.corridas, 0)
                          const pct = Math.min(Math.round((total / 300) * 100), 100)
                          return (
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: total >= 300 ? "#059669" : "#d97706",
                                  }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${total >= 300 ? "text-emerald-600" : "text-muted-foreground"}`}>
                                {formatNumber(total)}
                              </span>
                            </div>
                          )
                        })()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{lider.cidades.length}</TableCell>
                      <TableCell>{classBadge(lider.classificacao)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {lider.programStatus === "nao_iniciado" ? (
                            <Button
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={async () => { await startProgram(lider.id) }}
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              Iniciar
                            </Button>
                          ) : lider.programStatus !== "finalizado" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs gap-1"
                              onClick={() => window.location.href = `/programa?lider=${lider.id}`}
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              Acompanhar
                            </Button>
                          ) : (
                            <Badge variant="ouro" className="text-[10px]">
                              <CheckCircle2 className="h-3 w-3 mr-0.5" />
                              OK
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(lider)}>
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteId(lider.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este líder? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
