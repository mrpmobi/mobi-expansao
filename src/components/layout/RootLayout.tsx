import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { cn } from "@/utils"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/lideres": "Líderes",
  "/corporativos": "Corporativos",
  "/cidades": "Cidades",
  "/programa": "Programa de 4 Semanas",
  "/classificacao": "Classificação",
  "/roteiro": "Roteiro do Programa",
  "/reunioes": "Reuniões",
  "/relatorios": "Relatórios",
}

export function RootLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname === path ? true : location.pathname.startsWith(path) && path !== "/"
  )?.[1] || "Dashboard"

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <Header title={title} onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  )
}
