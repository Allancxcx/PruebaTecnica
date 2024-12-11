import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { useToast } from "@/hooks/use-toast"
import EmployeeList from "../Components/ui/EmployeeList"
import EmployeeForm from "../Components/ui/EmployeeForm"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAdmin, setIsAdmin] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [employees, setEmployees] = useState([])
  const { isAuthenticated, isLoading, logout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees()
    }
  }, [isAuthenticated])

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees()
      setEmployees(data)
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        title: "Error",
        description: "No se pudieron obtener los empleados. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleEmployeeAdded = () => {
    fetchEmployees()
    setShowForm(false)
    toast({
      title: "Éxito",
      description: "Empleado agregado correctamente.",
    })
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Panel de Control</h1>
      <Button onClick={logout} className="mb-4">
        Cerrar Sesión
      </Button>
      {isAdmin && (
        <Button onClick={() => setShowForm(!showForm)} className="mb-4 ml-4">
          {showForm ? "Ocultar Formulario" : "Agregar Nuevo Empleado"}
        </Button>
      )}
      {showForm && (
        <EmployeeForm
          onEmployeeAdded={handleEmployeeAdded}
          onHideForm={() => setShowForm(false)}
        />
      )}
      <EmployeeList 
        isAdmin={isAdmin} 
        employees={employees} 
        onEmployeeDeleted={fetchEmployees}
        onEmployeeUpdated={fetchEmployees}
      />
    </div>
  )
}

