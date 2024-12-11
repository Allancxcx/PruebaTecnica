import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { KPICard } from "./KPICard";
import { ScrollArea } from "@/Components/ui/scroll-area";

interface Empleado {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  apellido: string;
  generoId: number;
  estadoCivilId: number;
  fechaNacimiento: string;
  dpi: string;
  nit: string;
  afilicacionIGGS: string;
  afiliacionIRTRA: string;
  numeroPassaporte: string;
  direccion: string;
  numeroTelefono: string;
  email: string;
  salario: number;
}

interface EmployeeListProps {
  isAdmin: boolean;
  employees: Empleado[];
  onEmployeeDeleted: () => void;
  onEmployeeUpdated: () => void;
}

export default function EmployeeList({ isAdmin, employees, onEmployeeDeleted, onEmployeeUpdated }: EmployeeListProps) {
  const { toast } = useToast();
  const [editingEmployee, setEditingEmployee] = useState<Empleado | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const employeesPerPage = 9;

  const handleDelete = async (id: number) => {
    try {
      await api.deleteEmployee(id);
      onEmployeeDeleted();
      toast({
        title: "Éxito",
        description: "Empleado eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting empleado:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el empleado. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (employee: Empleado) => {
    try {
      await api.updateEmployee(employee.id, employee);
      onEmployeeUpdated();
      setEditingEmployee(null);
      setIsDialogOpen(false);
      toast({
        title: "Éxito",
        description: "Empleado actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error updating empleado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el empleado. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.primerNombre} ${employee.segundoNombre} ${employee.apellido} ${employee.email} ${employee.dpi} ${employee.nit}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const maxSalary = Math.max(...employees.map(emp => emp.salario));
  const averageSalary = employees.reduce((sum, emp) => sum + emp.salario, 0) / employees.length;
  const totalEmployees = employees.length;


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resumen de Empleados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPICard title="Total de Empleados" value={totalEmployees} />
        <KPICard title="Salario Promedio" value={`$${averageSalary.toFixed(2)}`} />
        <KPICard title="Salario Máximo" value={`$${maxSalary.toFixed(2)}`} />
      </div>

      <h2 className="text-2xl font-bold mb-4">Lista de Empleados</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar empleados..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEmployees.map((empleado) => (
          <Card key={empleado.id}>
            <CardHeader>
              <CardTitle>{`${empleado.primerNombre} ${empleado.segundoNombre} ${empleado.apellido}`}</CardTitle>
              <CardDescription>{empleado.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Salario:</strong> ${empleado.salario.toFixed(2)}</p>
              <p><strong>Fecha de Nacimiento:</strong> {new Date(empleado.fechaNacimiento).toLocaleDateString()}</p>
              <p><strong>DPI:</strong> {empleado.dpi}</p>
              <p><strong>NIT:</strong> {empleado.nit}</p>
              <p><strong>Teléfono:</strong> {empleado.numeroTelefono}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isAdmin && (
                <>
                  <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) setEditingEmployee(empleado);
                    else setEditingEmployee(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] h-[80vh] p-6">
                      <DialogHeader>
                        <DialogTitle>Editar Empleado</DialogTitle>
                        <DialogDescription>
                          Realiza cambios en los detalles del empleado aquí.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingEmployee) handleUpdate(editingEmployee);
                      }}>
                        <ScrollArea className="h-[calc(80vh-180px)] pr-4">
                          <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="primerNombre" className="w-[200px] text-right">
                              Primer Nombre
                            </Label>
                            <Input
                              id="primerNombre"
                              value={editingEmployee?.primerNombre || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, primerNombre: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="segundoNombre" className="w-[200px] text-right">
                              Segundo Nombre
                            </Label>
                            <Input
                              id="segundoNombre"
                              value={editingEmployee?.segundoNombre || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, segundoNombre: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="apellido" className="w-[200px] text-right">
                              Apellido
                            </Label>
                            <Input
                              id="apellido"
                              value={editingEmployee?.apellido || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, apellido: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="email" className="w-[200px] text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={editingEmployee?.email || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, email: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="numeroTelefono" className="w-[200px] text-right">
                              Teléfono
                            </Label>
                            <Input
                              id="numeroTelefono"
                              value={editingEmployee?.numeroTelefono || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, numeroTelefono: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="direccion" className="w-[200px] text-right">
                              Dirección
                            </Label>
                            <Input
                              id="direccion"
                              value={editingEmployee?.direccion || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, direccion: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="dpi" className="w-[200px] text-right">
                              DPI
                            </Label>
                            <Input
                              id="dpi"
                              value={editingEmployee?.dpi || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, dpi: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="nit" className="w-[200px] text-right">
                              NIT
                            </Label>
                            <Input
                              id="nit"
                              value={editingEmployee?.nit || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, nit: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="fechaNacimiento" className="w-[200px] text-right">
                              Fecha de Nacimiento
                            </Label>
                            <Input
                              id="fechaNacimiento"
                              type="date"
                              value={editingEmployee?.fechaNacimiento ? editingEmployee.fechaNacimiento.split('T')[0] : ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, fechaNacimiento: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="salario" className="w-[200px] text-right">
                              Salario
                            </Label>
                            <Input
                              id="salario"
                              type="number"
                              value={editingEmployee?.salario || 0}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, salario: parseFloat(e.target.value)}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="afilicacionIGGS" className="w-[200px] text-right">
                              Afiliación IGSS
                            </Label>
                            <Input
                              id="afilicacionIGGS"
                              value={editingEmployee?.afilicacionIGGS || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, afilicacionIGGS: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="afiliacionIRTRA" className="w-[200px] text-right">
                              Afiliación IRTRA
                            </Label>
                            <Input
                              id="afiliacionIRTRA"
                              value={editingEmployee?.afiliacionIRTRA || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, afiliacionIRTRA: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="numeroPassaporte" className="w-[200px] text-right">
                              Número de Pasaporte
                            </Label>
                            <Input
                              id="numeroPassaporte"
                              value={editingEmployee?.numeroPassaporte || ''}
                              onChange={(e) => setEditingEmployee(prev => ({...prev!, numeroPassaporte: e.target.value}))}
                              className="flex-1"
                            />
                          </div>
                          </div>
                        </ScrollArea>
                        <DialogFooter className="flex justify-end gap-2 mt-6">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit">Guardar cambios</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => handleDelete(empleado.id)} variant="destructive">
                    Eliminar
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }, (_, i) => (
          <Button
            key={i}
            onClick={() => paginate(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className="mx-1"
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}

