import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useToast } from "@/Components/ui/use-toast"
import { api } from "@/lib/api"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")
  const [roles, setRoles] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await api.getRoles()
        setRoles(data)
      } catch (error) {
        console.error("Error al obtener roles:", error)
      }
    }
    fetchRoles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.register(username, password, parseInt(roleId))
      toast({
        title: "Registro exitoso",
        description: "Te has registrado correctamente. Por favor, inicia sesión.",
      })
      router.push("/login")
    } catch (error) {
      console.error("Error de registro:", error)
      toast({
        title: "Error",
        description: "El registro falló. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Registrarse</h1>
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
        <div className="mb-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <div className="mb-6">
          <Select onValueChange={setRoleId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role: unknown) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          Registrarse
        </Button>
      </form>
    </div>
  )
}