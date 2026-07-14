import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/EmptyState"
import type { SemanaPrograma } from "@/types"

const nomesSemanas = [
  { tipo: "diagnostico" as const, titulo: "Semana 1 - Diagnóstico" },
  { tipo: "execucao" as const, titulo: "Semana 2 - Execução" },
  { tipo: "recuperacao" as const, titulo: "Semana 3 - Recuperação/Aceleração" },
  { tipo: "avaliacao" as const, titulo: "Semana 4 - Avaliação Final" },
]

export function ProgramaSemanasPage() {
  const { lideres, updateSemana } = useData()
  const [search, setSearch] = useState("")
  const [selectedLider, setSelectedLider] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("0")

  const filtered = useMemo(
    () =>
      lideres.filter((l) =>
        l.nome.toLowerCase().includes(search.toLowerCase())
      ),
    [lideres, search]
  )

  const lider = selectedLider
    ? lideres.find((l) => l.id === selectedLider)
    : null

  async function handleUpdateSemana(
    semanaIdx: number,
    field: keyof SemanaPrograma,
    value: string | number | boolean
  ) {
    if (!selectedLider) return
    await updateSemana(selectedLider, semanaIdx, { [field]: value } as any)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="sm:w-80 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Líderes</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[500px] overflow-y-auto">
            {filtered.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLider(l.id)
                  setActiveTab("0")
                }}
                className={`w-full text-left px-4 py-2.5 text-sm border-l-2 transition-colors hover:bg-muted ${
                  selectedLider === l.id
                    ? "border-primary bg-accent font-medium"
                    : "border-transparent"
                }`}
              >
                <p>{l.nome}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {l.cidades.length} cidades
                  </span>
                  <Badge
                    variant={
                      l.classificacao === "ouro"
                        ? "ouro"
                        : l.classificacao === "prata"
                          ? "prata"
                          : "vermelho"
                    }
                    className="text-[10px] px-1.5 py-0"
                  >
                    {l.classificacao}
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex-1">
          {!lider ? (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  title="Selecione um líder"
                  description="Escolha um líder na lista ao lado para acompanhar o programa."
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{lider.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Score: {lider.score}% | Classificação: {lider.classificacao}
                    </p>
                  </div>
                  <Badge
                    variant={
                      lider.classificacao === "ouro"
                        ? "ouro"
                        : lider.classificacao === "prata"
                          ? "prata"
                          : "vermelho"
                    }
                    className="text-sm px-3 py-1"
                  >
                    {lider.classificacao.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start overflow-x-auto">
                    {nomesSemanas.map((s, i) => (
                      <TabsTrigger key={i} value={String(i)} className="text-xs">
                        {s.titulo}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {lider.semanas.map((semana, idx) => (
                    <TabsContent key={idx} value={String(idx)} className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Nota: <strong>{semana.nota}</strong>/100
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Concluída</span>
                          <input
                            type="checkbox"
                            checked={semana.concluida}
                            onChange={(e) =>
                              handleUpdateSemana(idx, "concluida", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label>Objetivo</Label>
                          <Textarea
                            value={semana.objetivo}
                            onChange={(e) =>
                              handleUpdateSemana(idx, "objetivo", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Ações Planejadas</Label>
                            <Textarea
                              value={semana.acoesPlanejadas}
                              onChange={(e) =>
                                handleUpdateSemana(idx, "acoesPlanejadas", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Ações Executadas</Label>
                            <Textarea
                              value={semana.acoesExecutadas}
                              onChange={(e) =>
                                handleUpdateSemana(idx, "acoesExecutadas", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Dificuldades</Label>
                            <Textarea
                              value={semana.dificuldades}
                              onChange={(e) =>
                                handleUpdateSemana(idx, "dificuldades", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Observações</Label>
                            <Textarea
                              value={semana.observacoes}
                              onChange={(e) =>
                                handleUpdateSemana(idx, "observacoes", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Nota (0-100)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={semana.nota}
                            onChange={(e) =>
                              handleUpdateSemana(idx, "nota", Number(e.target.value))
                            }
                          />
                          <Progress value={semana.nota} className="mt-1" />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
