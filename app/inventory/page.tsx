"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/search-input"
import { ProductListItem } from "@/components/product-list-item"
import { InventoryFilters } from "@/components/inventory-filters"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInventory } from "@/hooks/use-inventory"
import { useAuth } from "@/hooks/use-auth"
import type { InventoryFilter } from "@/types/inventory"

export default function InventoryPage() {
  const router = useRouter()
  const { products } = useInventory()
  const { isLoading, user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<InventoryFilter>("all")

  // Filtrar productos por búsqueda
  const searchFilteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filtrar productos por estado de stock
  const getFilteredProducts = () => {
    switch (activeFilter) {
      case "out-of-stock":
        return searchFilteredProducts.filter((p) => p.quantity === 0)
      case "low-stock":
        return searchFilteredProducts.filter((p) => p.quantity <= p.minQuantity && p.quantity > 0)
      case "normal-stock":
        return searchFilteredProducts.filter((p) => p.quantity > p.minQuantity)
      default:
        return searchFilteredProducts
    }
  }

  const filteredProducts = getFilteredProducts()

  // Contar productos por categoría
  const counts = {
    all: searchFilteredProducts.length,
    outOfStock: searchFilteredProducts.filter((p) => p.quantity === 0).length,
    lowStock: searchFilteredProducts.filter((p) => p.quantity <= p.minQuantity && p.quantity > 0).length,
    normalStock: searchFilteredProducts.filter((p) => p.quantity > p.minQuantity).length,
  }

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
    <div className="min-h-screen bg-gray-50">

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar productos en inventario..." />

          <InventoryFilters activeFilter={activeFilter} 
          onFilterChange={(filter) => setActiveFilter((prev) => (prev === filter ? "all" : filter))} 
          counts={counts}/>

          {searchQuery && (
            <div className="text-sm text-gray-500">
              {searchFilteredProducts.length === 0
                ? `No se encontraron productos que coincidan con "${searchQuery}"`
                : `${searchFilteredProducts.length} ${searchFilteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}`}
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <Card className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.quantity === 0
                const isLowStock = product.quantity <= product.minQuantity && product.quantity > 0

                return (
                  <ProductListItem
                    isNew={false}
                    key={product.id}
                    product={product}
                    rightContent={
                      <div className="text-right">
                        <Badge
                          variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "default"}
                          className="text-sm px-2 py-1"
                        >
                          {product.quantity}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">Mín: {product.minQuantity}</p>
                      </div>
                    }
                  />
                )
              })}
            </Card>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-base">
                {searchQuery
                  ? "No se encontraron productos"
                  : activeFilter === "all"
                    ? "No hay productos en el inventario"
                    : `No hay productos con ${activeFilter === "out-of-stock" ? "stock agotado" : activeFilter === "low-stock" ? "stock bajo" : "stock normal"}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
