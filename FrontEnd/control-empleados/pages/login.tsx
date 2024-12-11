import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { useToast } from "@/Components/ui/use-toast"
import { api } from "@/lib/api"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await api.login(username, password)
      localStorage.setItem("token", data.token)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      toast({
        title: "Error",
        description: "Usuario o contraseña inválidos.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
          />
        </div>
        <div className="mb-6">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </form>
    </div>
  )
}