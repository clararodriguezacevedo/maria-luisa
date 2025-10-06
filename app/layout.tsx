"use client"

import { ReactNode, useState, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/hooks/use-auth"
import { LoginDialog } from "@/components/dialogs/login-dialog"
import { SignupDialog } from "@/components/dialogs/signup-dialog"
import { useInventory } from "@/hooks/use-inventory"
import type { Metadata } from 'next'
import './styles/globals.css'

// export const metadata: Metadata = {
//   title: 'Inventario Maria Luisa',
//   description: 'Creado por ITBA Computer Society',
//   generator: 'v0.dev',
// }

export default function RootLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading, register, login, logout } = useAuth()
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

  const pathname = usePathname()
  const router = useRouter()

  const pageTitle = useMemo(() => {
    switch (pathname) {
      case "/":
        return "Inicio"
      case "/notifications":
        return "Notificaciones"
      case "/usage":
        return "Productos Usados"
      case "/purchases":
        return "Productos Comprados"
      case "/history":
        return "Historial de consumos"
      case "/historicPurchases":
        return "Historial de compras"
      default:
        return "Inventario"
    }
  }, [pathname])

  const showBackButton = pathname !== "/"


  return (
    <html lang="es">
      <body className="bg-gray-50">
        <Header
          user={user}
          isAdmin={isAdmin}
          onLoginClick={() => setShowLogin(true)}
          onLogout={logout}
          showBackButton={showBackButton}
          onBackClick={() => router.push("/")}
          title={pageTitle}
        />

        <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLogin={handleLogin} onSignupClick={() => setShowSignup(true)} />
        <SignupDialog open={showSignup} onOpenChange={setShowSignup} onSignup={handleSignup} />

        <main>{children}</main>
      </body>
    </html>
  )
}
