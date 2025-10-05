"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { LoginDialog } from "@/components/dialogs/login-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignupDialog } from "@/components/dialogs/signup-dialog"
import { useInventory } from "@/hooks/use-inventory"
import { useAuth } from "@/hooks/use-auth"
import { Package, Minus, ShoppingCart, Bell, ChevronRight, History } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { lowStockItems, outOfStockItems, dailyUsage, dailyPurchases, usageHistory } = useInventory()
  const { isAdmin, user, isLoading, login, register, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)


  const handleLogin = async (email: string, password: string) => {
    return await login(email, password)
  }

  const handleSignup = async (email: string, password: string) => {
  const success = await register(email, password)
  if (success) {
    setShowSignup(false)
    setShowLogin(false) // <--- también cerramos login
  }
  return success
}



  const totalUsedToday = dailyUsage.reduce((sum, item) => sum + item.quantity, 0)
  const totalBoughtToday = dailyPurchases.reduce((sum, item) => sum + item.quantity, 0)
  const totalAlerts = lowStockItems.length + outOfStockItems.length
  const totalHistoryDays = usageHistory.length

  const navigationCards = [
    {
      title: "Notificaciones y Alertas de Stock",
      description: totalAlerts > 0 ? `${totalAlerts} productos requieren atención` : "No hay alertas pendientes",
      icon: Bell,
      href: "/notifications",
      
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      badge: totalAlerts > 0 ? totalAlerts : undefined,
    },
    {
      title: "Ver Inventario Completo",
      icon: Package,
      href: "/inventory",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Registrar Productos Usados",
      icon: Minus,
      href: "/usage",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      badge: totalUsedToday > 0 ? totalUsedToday : undefined,
    },
    {
      title: "Registrar Productos Comprados",
      icon: ShoppingCart,
      href: "/purchases",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      badge: totalBoughtToday > 0 ? totalBoughtToday : undefined,
      adminOnly: true,
    },
    {
      title: "Historial de Consumo",
      icon: History,
      href: "/history",
      color: totalAlerts > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200",
      iconColor: totalAlerts > 0 ? "text-red-600" : "text-gray-400",
      badge: totalHistoryDays > 0 ? totalHistoryDays : undefined,
      
    },
    {
      title: "Historial de Compras",
      icon: History,
      href: "/historicPurchases",
      color: totalAlerts > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200",
      iconColor: totalAlerts > 0 ? "text-red-600" : "text-gray-400",
      badge: undefined,
      
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        onLogout={logout}
        title="Panel Principal"
      />

      <div className="p-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Sistema de Gestión de Inventario</h2>
          </div>

          {navigationCards.map((card) => {
            // Ocultar opciones de admin si no está logueado
            if (card.href === "/usage" && !user) return null
            if (card.adminOnly && !isAdmin) return null

            return (
              <Card
                key={card.href}
                className={`${card.color} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => {
                  if (!user) {
                    setShowLogin(true)
                  } else {
                    router.push(card.href)
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white ${card.iconColor}`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base">{card.title}</h3>
                        <p className="text-gray-600 text-sm">{card.description ? card.description : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.badge && (
                        <Badge variant="secondary" className="bg-white text-xs">
                          {card.badge}
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <div className="text-center py-4 border-t border-gray-200 mt-6 space-x-2">
            {!user ? (
              <>
                <Button variant="outline" onClick={() => setShowLogin(true)}>
                  Iniciar Sesión
                </Button>
                <Button variant="secondary" onClick={() => setShowSignup(true)}>
                  Registrarse
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={logout}>
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLogin={handleLogin} onSignupClick={() => setShowSignup(true)} />
      <SignupDialog open={showSignup} onOpenChange={setShowSignup} onSignup={handleSignup} />
    </div>
  )
}
