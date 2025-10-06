"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, User, LogOut, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  user: any
  isAdmin: boolean
  onLoginClick: () => void
  onLogout: () => void
  showBackButton?: boolean
  onBackClick?: () => void
  title?: string
}

export function Header({
  user,
  isAdmin,
  onLoginClick,
  onLogout,
  showBackButton = false,
  onBackClick,
  title = "Inventario",
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b p-4 ">
      <div className="max-w-md mx-auto items-center flex flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBackButton && onBackClick && (
            <Button variant="ghost" size="sm" onClick={onBackClick}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Image src="/logo-hogar.png" alt="Logo" width={80} height={80} />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <div className="flex flex-col items-end gap-2 ">
          {user ? (
            <>
              <Badge variant="default" className="text-xs px-2 py-1">
                {isAdmin ? "Administrador" : "Usuario"}
              </Badge>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                <span className="text-sm">Salir</span>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={onLoginClick}>
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">Iniciar Sesión</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
