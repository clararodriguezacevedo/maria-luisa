"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (email: string, password: string) => Promise<boolean>
  onSignupClick: () => void
}

export function LoginDialog({ open, onOpenChange, onLogin, onSignupClick }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa el email y la contraseña")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await onLogin(email, password)
      if (success) {
        setEmail("")
        setPassword("")
        onOpenChange(false)
      } else {
        setError("Email o contraseña incorrectos")
      }
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Iniciar Sesión</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresar email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg py-6 mt-2"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-base">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresar contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg py-6 mt-2"
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
          <Button onClick={handleLogin} disabled={isLoading} className="w-full text-lg py-6">
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          <div className="space-y-2 mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tenés una cuenta?{" "}
              <button
                type="button"
                className="text-blue-600 underline hover:text-blue-800"
                onClick={onSignupClick} // pass this prop from the page
                disabled={isLoading}
              >
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
