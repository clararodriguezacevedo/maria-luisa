"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package } from "lucide-react"
import type { DailyUsageGroup, PurchasesGroup } from "@/types/inventory"
import { Timestamp } from "firebase/firestore"

interface UsageHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usageGroup: DailyUsageGroup | PurchasesGroup | null
}

function isDailyUsageGroup(obj: any): obj is DailyUsageGroup {
  return obj && typeof obj.date === 'string' && typeof obj.totalQuantity === 'number'
}

export function UsageHistoryDialog({ open, onOpenChange, usageGroup }: UsageHistoryDialogProps) {
  if (!usageGroup) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toISOString().split("T")[0]) return "Hoy"
    if (dateString === yesterday.toISOString().split("T")[0]) return "Ayer"
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (ts?: Timestamp) => {
    if (!ts) return "-"
    return ts.toDate().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Productos Usados
          </DialogTitle>
          <p className="text-sm text-gray-600">{formatDate(usageGroup.date)}</p>
        </DialogHeader>

        <div className="space-y-4">
          {isDailyUsageGroup(usageGroup) && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-blue-800">Total de unidades usadas:</span>
                <Badge variant="default" className="bg-blue-600">{usageGroup.totalQuantity}</Badge>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Detalle por producto:
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {usageGroup.items
                .sort((a, b) => b.quantity - a.quantity)
                .map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex flex-col p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 flex-1 truncate">{item.productName}</span>
                      <Badge variant="outline" className="ml-2">
                        {item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}
                      </Badge>
                    </div>
                    {/* Auditoría */}
                    {item.userEmail && (
                      <p className="text-xs text-gray-500 mt-1">
                        Registrado por <strong>{item.userEmail}</strong> a las {formatTime(item.timestamp)}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
