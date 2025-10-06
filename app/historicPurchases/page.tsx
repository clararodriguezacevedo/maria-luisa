"use client"
import { useAuth } from "@/hooks/use-auth"
import { useInventory } from "@/hooks/use-inventory"
import { HistoryPageTemplate } from "@/components/generic-historic-pages"
import { UsageHistoryDialog } from "@/components/dialogs/usage-history-dialog"
import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PurchasesGroup } from "@/types/inventory"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HistoricPurchasesPage() {
  const { historicPurchases } = useInventory()
  const router = useRouter()
    const { isLoading, user } = useAuth()
  
    useEffect(() => {
            if (!isLoading && !user) {
              router.push("/") // redirect to home or landing page
            }
          }, [isLoading, user, router])
        
      if (isLoading || !user) {
        // Optionally show a loader while checking auth
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
      }

  return (
    <HistoryPageTemplate<PurchasesGroup>
      title="Historial de Compras"
      data={historicPurchases}
      getDate={(group) => group.date}
      getSearchStrings={(group) => group.items.map((item) => item.productName)}
      renderBadges={(group) => (
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Package className="h-3 w-3 text-gray-400" />
            <Badge variant="outline" className="text-xs">
              {group.items.length}
            </Badge>
          </div>
        </div>
      )}
      renderDialog={(selected, open, setOpen) => (
        <UsageHistoryDialog
          open={open}
          onOpenChange={setOpen}
          usageGroup={selected}
        />
      )}
    />
  )
}
