"use client"

import { useState, useEffect } from "react"
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface UserData {
  role: "admin" | "user"
}

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<"admin" | "user" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          setRole(userDoc.data().role)
        } else {
          setRole(null)
        }
      } else {
        setUser(null)
        setRole(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // REGISTER
  const register = async (email: string, password: string, role: "user" | "admin" = "user") => {
    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: "user",
    })
    return true
  } catch (error) {
    throw error
  }

  }

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        setRole(userDoc.data().role)
      } else {
        console.warn("User logged in without a Firestore document.")
        setRole(null)
      }
      return true
    } catch (error: any) {
      console.error("Login error:", error.message)
      return false
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setRole(null)
  }

  return {
    user,
    role,
    isAdmin: role === "admin",
    isLoading,
    login,
    register,
    logout,
  }
}
