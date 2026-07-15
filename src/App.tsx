import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DataProvider } from "@/contexts/DataContext"
import { RootLayout } from "@/components/layout/RootLayout"
import { DashboardPage } from "@/pages/Dashboard/DashboardPage"
import { LideresPage } from "@/pages/Lideres/LideresPage"
import { CidadesPage } from "@/pages/Cidades/CidadesPage"
import { CorporativosPage } from "@/pages/Corporativos/CorporativosPage"
import { ProgramaSemanasPage } from "@/pages/ProgramaSemanas/ProgramaSemanasPage"
import { ClassificacaoPage } from "@/pages/Classificacao/ClassificacaoPage"
import { ReunioesPage } from "@/pages/Reunioes/ReunioesPage"
import { RelatoriosPage } from "@/pages/Relatorios/RelatoriosPage"
import { RoteiroPage } from "@/pages/Roteiro/RoteiroPage"

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lideres" element={<LideresPage />} />
            <Route path="/cidades" element={<CidadesPage />} />
            <Route path="/corporativos" element={<CorporativosPage />} />
            <Route path="/programa" element={<ProgramaSemanasPage />} />
            <Route path="/classificacao" element={<ClassificacaoPage />} />
            <Route path="/reunioes" element={<ReunioesPage />} />
            <Route path="/roteiro" element={<RoteiroPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  )
}
