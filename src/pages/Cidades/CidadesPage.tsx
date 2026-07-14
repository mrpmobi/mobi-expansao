import { useState, useMemo } from "react"
import {
  Search,
  Plus,
  Trash2,
  Save,
  X,
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
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatCurrency, formatNumber } from "@/utils"

export function CidadesPage() {
  const { lideres, corporativos, addCidade, updateCidade, deleteCidade } = useData()
  const [search, setSearch] = useState("")
  const [liderFilter, setLiderFilter] = useState<string>("todos")
  const [editCell, setEditCell] = useState<{ liderId: string; cidadeId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [deleteCidadeId, setDeleteCidadeId] = useState<{ liderId: string; cidadeId: string } | null>(null)
  const [newCidade, setNewCidade] = useState<{
    liderId: string
    nome: string
    estado: string
    motoristasAtivos: number
    passageirosAtivos: number
    corridas: number
    faturamento: number
    ticketMedio: number
    metaCorridas: number
    observacoes: string
  } | null>(null)

  const allCidades = useMemo(
    () =>
      lideres.flatMap((l) =>
        l.cidades.map((c) => ({
          ...c,
          liderNome: l.nome,
          liderId: l.id,
          mentorId: l.mentorId,
        }))
      ),
    [lideres]
  )

  const filtered = useMemo(
    () =>
      allCidades.filter((c) => {
        if (
          search &&
          !c.nome.toLowerCase().includes(search.toLowerCase()) &&
          !c.liderNome.toLowerCase().includes(search.toLowerCase())
        )
          return false
        if (liderFilter !== "todos" && c.liderId !== liderFilter) return false
        return true
      }),
    [allCidades, search, liderFilter]
  )

  function startEdit(liderId: string, cidadeId: string, field: string, value: any) {
    setEditCell({ liderId, cidadeId, field })
    setEditValue(String(value))
  }

  async function saveEdit() {
    if (!editCell) return
    const numValue = Number(editValue)
    const data =
      ["motoristasAtivos", "passageirosAtivos", "corridas", "metaCorridas"].includes(
        editCell.field
      )
        ? { [editCell.field]: Math.round(numValue) }
        : ["faturamento", "ticketMedio"].includes(editCell.field)
          ? { [editCell.field]: numValue }
          : { [editCell.field]: editValue }
    await updateCidade(editCell.liderId, editCell.cidadeId, data)
    setEditCell(null)
  }

  function cancelEdit() {
    setEditCell(null)
  }

  async function confirmDeleteCidade() {
    if (deleteCidadeId) {
      await deleteCidade(deleteCidadeId.liderId, deleteCidadeId.cidadeId)
      setDeleteCidadeId(null)
    }
  }

  function EditableCell({
    liderId,
    cidadeId,
    field,
    value,
    type = "text",
  }: {
    liderId: string
    cidadeId: string
    field: string
    value: any
    type?: "text" | "number"
  }) {
    const isEditing =
      editCell?.liderId === liderId &&
      editCell?.cidadeId === cidadeId &&
      editCell?.field === field

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            className="h-7 w-24 text-xs"
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit()
              if (e.key === "Escape") cancelEdit()
            }}
          />
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={saveEdit}>
            <Save className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={cancelEdit}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    const display =
      type === "number"
        ? field === "faturamento" || field === "ticketMedio"
          ? formatCurrency(value)
          : formatNumber(value)
        : value

    return (
      <span
        className="cursor-pointer hover:bg-muted px-1.5 py-0.5 rounded text-xs tabular-nums"
        onClick={() => startEdit(liderId, cidadeId, field, value)}
        title="Clique para editar"
      >
        {display}
      </span>
    )
  }

  async function handleAddCidade() {
    if (!newCidade) return
    await addCidade(newCidade.liderId, {
      nome: newCidade.nome,
      estado: newCidade.estado,
      motoristasAtivos: newCidade.motoristasAtivos,
      passageirosAtivos: newCidade.passageirosAtivos,
      corridas: newCidade.corridas,
      faturamento: newCidade.faturamento,
      ticketMedio: newCidade.ticketMedio,
      metaCorridas: newCidade.metaCorridas,
      observacoes: newCidade.observacoes,
    })
    setNewCidade(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cidade ou líder..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={liderFilter} onValueChange={setLiderFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar líder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os líderes</SelectItem>
              {lideres.map((l) => (
                <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={!!newCidade} onOpenChange={(o) => !o && setNewCidade(null)}>
          <DialogTrigger asChild>
            <Button onClick={() =>
              setNewCidade({
                liderId: lideres[0]?.id || "",
                nome: "",
                estado: "",
                motoristasAtivos: 0,
                passageirosAtivos: 0,
                corridas: 0,
                faturamento: 0,
                ticketMedio: 0,
                metaCorridas: 0,
                observacoes: "",
              })
            }>
              <Plus className="h-4 w-4 mr-1" /> Nova Cidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nova Cidade</DialogTitle>
              <DialogDescription>Cadastre uma nova cidade para um líder.</DialogDescription>
            </DialogHeader>
            {newCidade && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Líder</Label>
                  <Select
                    value={newCidade.liderId}
                    onValueChange={(v) => setNewCidade({ ...newCidade, liderId: v })}
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
                    <Label>Nome</Label>
                    <Input
                      value={newCidade.nome}
                      onChange={(e) => setNewCidade({ ...newCidade, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input
                      value={newCidade.estado}
                      onChange={(e) => setNewCidade({ ...newCidade, estado: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Motoristas Ativos</Label>
                    <Input
                      type="number"
                      value={newCidade.motoristasAtivos}
                      onChange={(e) =>
                        setNewCidade({ ...newCidade, motoristasAtivos: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Passageiros Ativos</Label>
                    <Input
                      type="number"
                      value={newCidade.passageirosAtivos}
                      onChange={(e) =>
                        setNewCidade({ ...newCidade, passageirosAtivos: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Corridas</Label>
                    <Input
                      type="number"
                      value={newCidade.corridas}
                      onChange={(e) =>
                        setNewCidade({ ...newCidade, corridas: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Faturamento</Label>
                    <Input
                      type="number"
                      value={newCidade.faturamento}
                      onChange={(e) =>
                        setNewCidade({ ...newCidade, faturamento: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ticket Médio</Label>
                    <Input
                      type="number"
                      value={newCidade.ticketMedio}
                      onChange={(e) =>
                        setNewCidade({ ...newCidade, ticketMedio: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta de Corridas</Label>
                    <Input
                      type="number"
                      value={newCidade.metaCorridas}
                      onChange={(e) =>
                        setNewCidade({ ...newCidade, metaCorridas: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCidade(null)}>Cancelar</Button>
              <Button onClick={handleAddCidade}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cidades ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState title="Nenhuma cidade encontrada" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Líder</TableHead>
                    <TableHead className="text-right">Motoristas</TableHead>
                    <TableHead className="text-right">Passageiros</TableHead>
                    <TableHead className="text-right">Corridas</TableHead>
                    <TableHead className="text-right">Faturamento</TableHead>
                    <TableHead className="text-right">Ticket Médio</TableHead>
                    <TableHead className="text-right">Meta</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{c.nome}</p>
                          <p className="text-xs text-muted-foreground">{c.estado}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{c.liderNome}</TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          liderId={c.liderId}
                          cidadeId={c.id}
                          field="motoristasAtivos"
                          value={c.motoristasAtivos}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          liderId={c.liderId}
                          cidadeId={c.id}
                          field="passageirosAtivos"
                          value={c.passageirosAtivos}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          liderId={c.liderId}
                          cidadeId={c.id}
                          field="corridas"
                          value={c.corridas}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          liderId={c.liderId}
                          cidadeId={c.id}
                          field="faturamento"
                          value={c.faturamento}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          liderId={c.liderId}
                          cidadeId={c.id}
                          field="ticketMedio"
                          value={c.ticketMedio}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <EditableCell
                          liderId={c.liderId}
                          cidadeId={c.id}
                          field="metaCorridas"
                          value={c.metaCorridas}
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() =>
                            setDeleteCidadeId({ liderId: c.liderId, cidadeId: c.id })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!deleteCidadeId}
        onOpenChange={(o) => !o && setDeleteCidadeId(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta cidade?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCidadeId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCidade}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
