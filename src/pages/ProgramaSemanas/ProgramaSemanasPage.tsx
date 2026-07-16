import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, PlayCircle, CheckCircle2, ArrowRight, Circle, Target, TrendingUp, AlertTriangle } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatNumber } from "@/utils"
import type { ProgramStatus } from "@/types"

const programSteps: ProgramStatus[] = ["nao_iniciado", "semana_1", "semana_2", "semana_3", "semana_4", "finalizado"]

const stepMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
  nao_iniciado: { label: "Não iniciado", color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-300" },
  semana_1: { label: "Semana 1 - Diagnóstico", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  semana_2: { label: "Semana 2 - Execução", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  semana_3: { label: "Semana 3 - Recuperação", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  semana_4: { label: "Semana 4 - Avaliação", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  finalizado: { label: "Finalizado", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
}

export function ProgramaSemanasPage() {
  const { lideres, corporativos, startProgram, concludeWeek, updateSemana } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")

  const selectedId = searchParams.get("lider")
  const lider = selectedId ? lideres.find((l) => l.id === selectedId) : null

  const filtered = useMemo(
    () =>
      lideres.filter((l) =>
        l.nome.toLowerCase().includes(search.toLowerCase())
      ),
    [lideres, search]
  )

  const stepIdx = lider ? programSteps.indexOf(lider.programStatus) : -1

  const semanaData = [
    {
      semana: 1,
      status: "semana_1" as ProgramStatus,
      fields: [
        { key: "objetivo", label: "Objetivo da semana", type: "textarea" },
        { key: "acoesPlanejadas", label: "Principais dificuldades", type: "textarea" },
        { key: "metasDefinidas", label: "Metas definidas", type: "textarea" },
        { key: "dificuldades", label: "Ações planejadas", type: "textarea" },
        { key: "agendaVisitas", label: "Agenda de visitas", type: "textarea" },
        { key: "observacoes", label: "Observações", type: "textarea" },
      ],
      checklist: [
        { key: "reuniaoRealizada", label: "Reunião realizada" },
        { key: "indicadoresAnalisados", label: "Indicadores analisados" },
        { key: "dificuldadesLevantadas", label: "Dificuldades levantadas" },
        { key: "metasDefinidasCheck", label: "Metas definidas" },
        { key: "agendaOrganizada", label: "Agenda organizada" },
      ],
      concluirLabel: "Concluir Semana 1",
    },
    {
      semana: 2,
      status: "semana_2" as ProgramStatus,
      fields: [
        { key: "acoesExecutadas", label: "Campanhas realizadas", type: "textarea" },
        { key: "campanhas", label: "Empresas visitadas", type: "textarea" },
        { key: "motoristasCaptados", label: "Motoristas captados", type: "number" },
        { key: "passageirosCaptados", label: "Passageiros captados", type: "number" },
        { key: "corridasSemana", label: "Corridas", type: "number" },
        { key: "observacoes", label: "Observações", type: "textarea" },
      ],
      checklist: [
        { key: "visitasRealizadas", label: "Visitas realizadas" },
        { key: "campanhasExecutadas", label: "Campanhas executadas" },
        { key: "corridasAcompanhadas", label: "Corridas acompanhadas" },
        { key: "indicadoresAtualizados", label: "Indicadores atualizados" },
      ],
      concluirLabel: "Concluir Semana 2",
    },
    {
      semana: 3,
      status: "semana_3" as ProgramStatus,
      fields: [
        { key: "dificuldades", label: "Problemas encontrados", type: "textarea" },
        { key: "planoRecuperacao", label: "Plano de recuperação", type: "textarea" },
        { key: "planoAceleracao", label: "Plano de aceleração", type: "textarea" },
        { key: "apoiosNecessarios", label: "Apoios necessários", type: "textarea" },
        { key: "observacoes", label: "Observações", type: "textarea" },
      ],
      checklist: [
        { key: "gargalosIdentificados", label: "Gargalos identificados" },
        { key: "planoCriado", label: "Plano criado" },
        { key: "ajustesRealizados", label: "Ajustes realizados" },
        { key: "reuniaoRealizada3", label: "Reunião realizada" },
      ],
      concluirLabel: "Concluir Semana 3",
    },
    {
      semana: 4,
      status: "semana_4" as ProgramStatus,
      fields: [
        { key: "metaAtingida", label: "Meta atingida", type: "textarea" },
        { key: "comprometimento", label: "Comprometimento", type: "number" },
        { key: "lideranca", label: "Liderança", type: "number" },
        { key: "resultadoFinal", label: "Resultado final", type: "textarea" },
        { key: "observacoes", label: "Observações", type: "textarea" },
      ],
      checklist: [
        { key: "avaliacaoRealizada", label: "Avaliação realizada" },
        { key: "feedbackApresentado", label: "Feedback apresentado" },
        { key: "proximosPassos", label: "Próximos passos definidos" },
      ],
      concluirLabel: "Finalizar Programa",
    },
  ]

  if (!lider) {
    return (
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar líder..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState title="Selecione um líder" description="Clique em 'Acompanhar' na lista de líderes ou use a busca acima." />
          </CardContent>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 12).map((l) => {
            const ps = stepMeta[l.programStatus]
            return (
              <button
                key={l.id}
                onClick={() => setSearchParams({ lider: l.id })}
                className={`text-left p-4 rounded-lg border hover:shadow-md transition-shadow ${ps.bg} ${ps.border}`}
              >
                <p className="font-medium text-sm">{l.nome}</p>
                <p className={`text-xs mt-1 ${ps.color}`}>{ps.label}</p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const currentIdx = stepIdx
  const currentWeekIdx = currentIdx - 1
  const currentWeek = currentWeekIdx >= 0 && currentWeekIdx < 4 ? semanaData[currentWeekIdx] : null
  const canAccess = (weekIdx: number) => weekIdx <= currentWeekIdx

  const totalCorridasLider = lider
    ? lider.cidades.reduce((a, c) => a + c.corridas, 0)
    : 0
  const pctMeta = Math.min(Math.round((totalCorridasLider / 300) * 100), 100)

  async function handleConclude() {
    if (!lider || currentWeekIdx < 0 || currentWeekIdx > 3) return
    await concludeWeek(lider.id, currentWeekIdx)
  }

  async function handleStart() {
    if (!lider) return
    await startProgram(lider.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{lider.nome}</h2>
          <p className="text-sm text-muted-foreground">
            {lider.estado} &middot; {lider.regiao} &middot; {lider.cidades.length} cidades
          </p>
        </div>
        <Button variant="outline" onClick={() => setSearchParams({})}>
          Trocar líder
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Timeline do Programa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {programSteps.map((step, i) => {
              const meta = stepMeta[step]
              const isCurrent = i === currentIdx
              const isPast = i < currentIdx
              const isFuture = i > currentIdx
              return (
                <div key={step} className="flex items-center gap-1 shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                      ${isCurrent ? "bg-blue-500 text-white border-blue-500" : ""}
                      ${isPast ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                      ${isFuture ? "bg-gray-50 text-gray-400 border-gray-200" : ""}
                    `}
                  >
                    {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : isCurrent ? <Circle className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    {meta.label.replace(/ -.*/, "")}
                  </div>
                  {i < programSteps.length - 1 && (
                    <ArrowRight className={`h-4 w-4 ${isPast ? "text-emerald-400" : "text-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {lider.programStatus === "nao_iniciado" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <PlayCircle className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Programa não iniciado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clique no botão abaixo para iniciar o programa de 30 dias para {lider.nome}.
            </p>
            <Button size="lg" onClick={handleStart}>
              <PlayCircle className="h-5 w-5 mr-2" />
              Iniciar Programa
            </Button>
          </CardContent>
        </Card>
      )}

      {lider.programStatus === "finalizado" && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-emerald-700">Programa Finalizado</h3>
            <p className="text-sm text-emerald-600 mt-1">
              Score: {lider.score}% &middot; Classificação: {lider.classificacao}
            </p>
            <p className="text-sm text-emerald-600 mt-2 max-w-lg mx-auto">{lider.feedback}</p>
          </CardContent>
        </Card>
      )}

      {currentWeek && canAccess(currentWeekIdx) && lider.programStatus !== "nao_iniciado" && lider.programStatus !== "finalizado" && (
        <Card className={`border-t-4 ${currentWeek.semana === 1 ? "border-t-blue-500" : currentWeek.semana === 2 ? "border-t-yellow-500" : currentWeek.semana === 3 ? "border-t-orange-500" : "border-t-violet-500"}`}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant={currentWeek.semana === 1 ? "default" : currentWeek.semana === 2 ? "prata" : currentWeek.semana === 3 ? "prata" : "default"}>
                Semana {currentWeek.semana}
              </Badge>
              {currentWeekIdx === 3 ? "Avaliação Final" : currentWeekIdx === 0 ? "Diagnóstico e Organização" : currentWeekIdx === 1 ? "Execução Intensiva" : "Recuperação ou Aceleração"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentWeek.semana === 1 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 flex items-center gap-4">
                  <Target className="h-8 w-8 text-blue-500 shrink-0" />
                  <div className="flex-1 text-sm">
                    <p><strong>Corridas atuais:</strong> {formatNumber(totalCorridasLider)} / 300</p>
                    <p><strong>Diferença:</strong> {totalCorridasLider >= 300 ? "Meta atingida!" : `${formatNumber(300 - totalCorridasLider)} corridas restantes`}</p>
                    <Progress value={pctMeta} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentWeek.semana === 2 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 flex items-center gap-4">
                  <TrendingUp className="h-8 w-8 text-yellow-600 shrink-0" />
                  <div className="flex-1 text-sm">
                    <p><strong>Evolução das corridas:</strong></p>
                    <p>Atual: {formatNumber(totalCorridasLider)} corridas</p>
                    <p>Meta: 300 corridas</p>
                    <Progress value={pctMeta} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentWeek.semana === 3 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4 flex items-center gap-4">
                  <AlertTriangle className="h-8 w-8 text-orange-600 shrink-0" />
                  <div className="flex-1 text-sm">
                    <p><strong>Quanto falta para atingir a meta:</strong></p>
                    {totalCorridasLider >= 300 ? (
                      <p className="text-emerald-700 font-medium">Meta já atingida! ({formatNumber(totalCorridasLider)} corridas)</p>
                    ) : (
                      <p>Faltam {formatNumber(300 - totalCorridasLider)} corridas para atingir 300</p>
                    )}
                    <Progress value={pctMeta} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentWeek.semana === 4 && (
              <Card className="border-violet-200 bg-violet-50">
                <CardContent className="p-4 flex items-center gap-4">
                  <CheckCircle2 className="h-8 w-8 text-violet-600 shrink-0" />
                  <div className="flex-1 text-sm">
                    <p><strong>Meta atingida?</strong> {totalCorridasLider >= 300 ? <span className="text-emerald-600 font-bold">SIM</span> : <span className="text-red-600 font-bold">NÃO</span>}</p>
                    <p><strong>Corridas realizadas:</strong> {formatNumber(totalCorridasLider)}</p>
                    <p><strong>Percentual:</strong> {pctMeta}%</p>
                    <Progress value={pctMeta} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {currentWeek.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-sm">{field.label}</Label>
                  {field.type === "number" ? (
                    <Input
                      type="number"
                      value={(lider.semanas[currentWeekIdx] as any)?.[field.key] || ""}
                      onChange={(e) =>
                        updateSemana(lider.id, currentWeekIdx, {
                          [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                        } as any)
                      }
                    />
                  ) : (
                    <Textarea
                      value={(lider.semanas[currentWeekIdx] as any)?.[field.key] || ""}
                      onChange={(e) =>
                        updateSemana(lider.id, currentWeekIdx, {
                          [field.key]: e.target.value,
                        } as any)
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <Label className="text-sm mb-2 block">Checklist</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {currentWeek.checklist.map((item) => (
                  <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm">Nota da semana (0-100)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={lider.semanas[currentWeekIdx]?.nota || 0}
                onChange={(e) => updateSemana(lider.id, currentWeekIdx, { nota: Number(e.target.value) })}
                className="max-w-[200px]"
              />
              <Progress value={lider.semanas[currentWeekIdx]?.nota || 0} className="h-1.5 mt-1" />
            </div>

            <div className="flex justify-end pt-2">
              <Button size="lg" onClick={handleConclude}>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {currentWeek.concluirLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentWeek && lider.semanas[currentWeekIdx]?.concluida && currentWeekIdx < 3 && (
        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-emerald-700 font-medium">Semana {currentWeek.semana} concluída!</p>
          <p className="text-sm text-emerald-600 mt-0.5">A Semana {currentWeek.semana + 1} já está disponível.</p>
        </div>
      )}
    </div>
  )
}
