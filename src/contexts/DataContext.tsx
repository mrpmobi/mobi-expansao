import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Lider, Corporativo, Diretor, Reuniao, Cidade, SemanaPrograma, FeedbackItem, DashboardIndicadores } from "@/types"
import { liderService } from "@/services/liderService"
import { reuniaoService } from "@/services/reuniaoService"
import { dashboardService } from "@/services/dashboardService"
import { diretores as mockDiretores, corporativos as mockCorporativos } from "@/mocks"

interface DataContextType {
  diretores: Diretor[]
  corporativos: Corporativo[]
  lideres: Lider[]
  reunioes: Reuniao[]
  indicadores: DashboardIndicadores | null
  loading: boolean
  refreshLideres: () => Promise<void>
  refreshReunioes: () => Promise<void>
  refreshIndicadores: () => Promise<void>
  addLider: (data: any) => Promise<Lider>
  updateLider: (id: string, data: Partial<Lider>) => Promise<Lider>
  deleteLider: (id: string) => Promise<void>
  addCidade: (liderId: string, cidade: Omit<Cidade, "id">) => Promise<Lider>
  updateCidade: (liderId: string, cidadeId: string, data: Partial<Cidade>) => Promise<Lider>
  deleteCidade: (liderId: string, cidadeId: string) => Promise<Lider>
  updateSemana: (liderId: string, semanaIdx: number, data: Partial<SemanaPrograma>) => Promise<Lider>
  updateFeedbackItens: (liderId: string, itens: FeedbackItem[]) => Promise<Lider>
  startProgram: (liderId: string) => Promise<Lider>
  concludeWeek: (liderId: string, semanaIdx: number) => Promise<Lider>
  addReuniao: (data: Omit<Reuniao, "id">) => Promise<Reuniao>
  updateReuniao: (id: string, data: Partial<Reuniao>) => Promise<Reuniao>
  deleteReuniao: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [diretores] = useState<Diretor[]>(mockDiretores)
  const [corporativos] = useState<Corporativo[]>(mockCorporativos)
  const [lideres, setLideres] = useState<Lider[]>([])
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [indicadores, setIndicadores] = useState<DashboardIndicadores | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshLideres = useCallback(async () => {
    const data = await liderService.getAll()
    setLideres(data)
  }, [])

  const refreshReunioes = useCallback(async () => {
    const data = await reuniaoService.getAll()
    setReunioes(data)
  }, [])

  const refreshIndicadores = useCallback(async () => {
    const data = await dashboardService.getIndicadores()
    setIndicadores(data)
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      await Promise.all([refreshLideres(), refreshReunioes(), refreshIndicadores()])
      setLoading(false)
    }
    load()
  }, [refreshLideres, refreshReunioes, refreshIndicadores])

  const addLider = useCallback(async (data: any) => {
    const novo = await liderService.create(data)
    await refreshLideres()
    await refreshIndicadores()
    return novo
  }, [refreshLideres, refreshIndicadores])

  const updateLider = useCallback(async (id: string, data: Partial<Lider>) => {
    const updated = await liderService.update(id, data)
    await refreshLideres()
    await refreshIndicadores()
    return updated
  }, [refreshLideres, refreshIndicadores])

  const deleteLider = useCallback(async (id: string) => {
    await liderService.delete(id)
    await refreshLideres()
    await refreshIndicadores()
  }, [refreshLideres, refreshIndicadores])

  const addCidade = useCallback(async (liderId: string, cidade: Omit<Cidade, "id">) => {
    const lider = await liderService.addCidade(liderId, cidade)
    await refreshLideres()
    await refreshIndicadores()
    return lider
  }, [refreshLideres, refreshIndicadores])

  const updateCidade = useCallback(async (liderId: string, cidadeId: string, data: Partial<Cidade>) => {
    const lider = await liderService.updateCidade(liderId, cidadeId, data)
    await refreshLideres()
    await refreshIndicadores()
    return lider
  }, [refreshLideres, refreshIndicadores])

  const deleteCidade = useCallback(async (liderId: string, cidadeId: string) => {
    const lider = await liderService.deleteCidade(liderId, cidadeId)
    await refreshLideres()
    await refreshIndicadores()
    return lider
  }, [refreshLideres, refreshIndicadores])

  const updateSemana = useCallback(async (liderId: string, semanaIdx: number, data: Partial<SemanaPrograma>) => {
    const lider = await liderService.updateSemana(liderId, semanaIdx, data)
    await refreshLideres()
    await refreshIndicadores()
    return lider
  }, [refreshLideres, refreshIndicadores])

  const updateFeedbackItens = useCallback(async (liderId: string, itens: FeedbackItem[]) => {
    const lider = await liderService.updateFeedbackItens(liderId, itens)
    await refreshLideres()
    await refreshIndicadores()
    return lider
  }, [refreshLideres, refreshIndicadores])

  const startProgram = useCallback(async (liderId: string) => {
    const lider = await liderService.startProgram(liderId)
    await refreshLideres()
    await refreshIndicadores()
    return lider
  }, [refreshLideres, refreshIndicadores])

  const concludeWeek = useCallback(async (liderId: string, semanaIdx: number) => {
    const lider = await liderService.concludeWeek(liderId, semanaIdx)
    await refreshLideres()
    await refreshIndicadores()
    return lider
  }, [refreshLideres, refreshIndicadores])

  const addReuniao = useCallback(async (data: Omit<Reuniao, "id">) => {
    const nova = await reuniaoService.create(data)
    await refreshReunioes()
    return nova
  }, [refreshReunioes])

  const updateReuniao = useCallback(async (id: string, data: Partial<Reuniao>) => {
    const updated = await reuniaoService.update(id, data)
    await refreshReunioes()
    return updated
  }, [refreshReunioes])

  const deleteReuniao = useCallback(async (id: string) => {
    await reuniaoService.delete(id)
    await refreshReunioes()
  }, [refreshReunioes])

  return (
    <DataContext.Provider
      value={{
        diretores,
        corporativos,
        lideres,
        reunioes,
        indicadores,
        loading,
        refreshLideres,
        refreshReunioes,
        refreshIndicadores,
        addLider,
        updateLider,
        deleteLider,
        addCidade,
        updateCidade,
        deleteCidade,
        updateSemana,
        updateFeedbackItens,
        startProgram,
        concludeWeek,
        addReuniao,
        updateReuniao,
        deleteReuniao,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}
