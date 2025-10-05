"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FirebaseError } from "firebase/app"

interface SignupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignup: (email: string, password: string) => Promise<boolean>
}

export function SignupDialog({ open, onOpenChange, onSignup }: SignupDialogProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSignup = async () => {
    setLoading(true)
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa email y contraseña")
      setLoading(false)
      return
    }

    try {
      const success = await onSignup(email, password)
      if (!success) {
        setError("Error desconocido al registrarse")
      } else {
        onOpenChange(false) // cerrar dialogo al registrarse correctamente
        setEmail("")
        setPassword("")
      }
    } catch (err: any) {
      let message = "Error al registrarse"
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            message = "El email ya está registrado"
            break
          case "auth/invalid-email":
            message = "Email inválido"
            break
          case "auth/weak-password":
            message = "La contraseña es muy débil (mínimo 6 caracteres)"
            break
          default:
            message = err.message || message
        }
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Registrarse</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@mail.com"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={handleSignup} disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
