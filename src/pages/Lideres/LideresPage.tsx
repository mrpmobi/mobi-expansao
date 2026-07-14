import { useState, useMemo } from "react"
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  ChevronDown,
  MoreHorizontal,
  MapPin,
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
import type { Regiao } from "@/types"

const regioes: Regiao[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]

export function LideresPage() {
  const { lideres, corporativos, addLider, updateLider, deleteLider } = useData()
  const [search, setSearch] = useState("")
  const [regiaoFilter, setRegiaoFilter] = useState<string>("todas")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
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
        if (statusFilter !== "todos" && l.status !== statusFilter) return false
        if (mentorFilter !== "todos" && l.mentorId !== mentorFilter) return false
        return true
      }),
    [lideres, search, regiaoFilter, statusFilter, mentorFilter]
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="recuperacao">Recuperação</SelectItem>
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
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Cidades</TableHead>
                  <TableHead className="hidden lg:table-cell">Corridas</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lider) => {
                  const mentor = corporativos.find((c) => c.id === lider.mentorId)
                  const totalCorridas = lider.cidades.reduce((a, c) => a + c.corridas, 0)
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
                        <Badge
                          variant={
                            lider.status === "ativo"
                              ? "default"
                              : lider.status === "recuperacao"
                                ? "prata"
                                : "secondary"
                          }
                        >
                          {lider.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{lider.cidades.length}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatNumber(totalCorridas)}</TableCell>
                      <TableCell>{classBadge(lider.classificacao)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(lider)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setDeleteId(lider.id)}>
                            <Trash2 className="h-4 w-4" />
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
