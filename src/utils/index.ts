import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ouro: "text-emerald-600 bg-emerald-50 border-emerald-200",
    prata: "text-yellow-600 bg-yellow-50 border-yellow-200",
    vermelho: "text-red-600 bg-red-50 border-red-200",
    ativo: "text-blue-600 bg-blue-50 border-blue-200",
    inativo: "text-gray-600 bg-gray-50 border-gray-200",
    concluido: "text-green-600 bg-green-50 border-green-200",
    andamento: "text-orange-600 bg-orange-50 border-orange-200",
  }
  return map[status.toLowerCase()] || "text-gray-600 bg-gray-50 border-gray-200"
}
