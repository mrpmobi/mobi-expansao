import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Calendar,
  Trophy,
  Handshake,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/lideres", icon: Users, label: "Líderes" },
  { to: "/corporativos", icon: Building2, label: "Corporativos" },
  { to: "/cidades", icon: MapPin, label: "Cidades" },
  { to: "/programa", icon: Calendar, label: "Programa de 4 Semanas" },
  { to: "/classificacao", icon: Trophy, label: "Classificação" },
  { to: "/reunioes", icon: Handshake, label: "Reuniões" },
  { to: "/roteiro", icon: BookOpen, label: "Roteiro do Programa" },
  { to: "/relatorios", icon: FileText, label: "Relatórios" },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
            Mobi
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-3">
        <p className={cn("text-xs text-sidebar-foreground/50", collapsed && "hidden")}>
          Programa de Expansão
        </p>
      </div>
    </aside>
  )
}
