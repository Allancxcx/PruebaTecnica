"use client"

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useToast } from "@/Components/ui/use-toast"
import { api } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"

interface EmployeeFormProps {
  onEmployeeAdded: () => void;
  onHideForm: () => void;
}
interface EmpleadoFormData {
  primerNombre: string;
  segundoNombre: string;
  apellido: string;
  genderoId: string;
  estadoCivilId: string;
  fechaNacimiento: string;
  dpi: string;
  nit: string;
  afilicacionIGGS: string;
  afiliacionIRTRA: string;
  numeroPassaporte: string;
  direccion: string;
  numeroTelefono: string;
  email: string;
  salario: string;
}

interface Genero {
  id: number;
  nombre: string;
}

interface EstadoCivil {
  id: number;
  nombre: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EmployeeForm: React.FC<EmployeeFormProps> =({ onEmployeeAdded, onHideForm})=> {
  const { register, handleSubmit, control, formState: { errors } } = useForm<EmpleadoFormData>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [estadosCiviles, setEstadosCiviles] = useState<EstadoCivil[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<EmpleadoFormData | null>(null);

  useEffect(() => {
    fetchGeneros();
    fetchEstadosCiviles();
  }, []);

  const fetchGeneros = async () => {
    try {
      const data = await api.getGenders();
      setGeneros(data);
    } catch (error) {
      console.error("Error fetching genders:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los géneros. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  const fetchEstadosCiviles = async () => {
    try {
      const data = await api.getMaritalstatuses();
      setEstadosCiviles(data);
    } catch (error) {
      console.error("Error fetching marital statuses:", error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los estados civiles. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: EmpleadoFormData) => {
    setFormData(data);
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    try {
      const formattedData = {
        id: 0,
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        apellido: formData.apellido,
        generoId: parseInt(formData.genderoId),
        estadoCivilId: formData.estadoCivilId ? parseInt(formData.estadoCivilId) : null,
        fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
        dpi: formData.dpi,
        nit: formData.nit || null,
        afilicacionIGGS: formData.afilicacionIGGS || null,
        afiliacionIRTRA: formData.afiliacionIRTRA || null,
        numeroPassaporte: formData.numeroPassaporte || null,
        direccion: formData.direccion,
        numeroTelefono: formData.numeroTelefono,
        email: formData.email,
        salario: parseFloat(formData.salario)
      };

      await api.addEmployee(formattedData);
      toast({
        title: "Éxito",
        description: "Empleado agregado correctamente.",
      });
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el empleado. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Agregar Nuevo Empleado</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primerNombre">Primer Nombre</Label>
              <Input
                id="primerNombre"
                {...register("primerNombre", {
                  required: "Este campo es requerido",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: { value: /^[A-Za-z]+$/, message: "Solo se permiten letras" }
                })} />
              {errors.primerNombre && <span className="text-red-500 text-sm">{errors.primerNombre.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="segundoNombre">Segundo Nombre</Label>
              <Input
                id="segundoNombre"
                {...register("segundoNombre", {
                  required: "Este campo es requerido",
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                  pattern: { value: /^[A-Za-z]+$/, message: "Solo se permiten letras" }
                })} />
              {errors.segundoNombre && <span className="text-red-500 text-sm">{errors.segundoNombre.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                {...register("apellido", {
                  required: "Este campo es requerido",
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                  pattern: { value: /^[A-Za-z]+$/, message: "Solo se permiten letras" }
                })} />
              {errors.apellido && <span className="text-red-500 text-sm">{errors.apellido.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genderoId">Género</Label>
              <Controller
                name="genderoId"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un género" />
                    </SelectTrigger>
                    <SelectContent>
                      {generos.map((genero) => (
                        <SelectItem key={genero.id} value={genero.id.toString()}>{genero.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              {errors.genderoId && <span className="text-red-500 text-sm">{errors.genderoId.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoCivilId">Estado Civil</Label>
              <Controller
                name="estadoCivilId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado civil" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosCiviles.map((estadoCivil) => (
                        <SelectItem key={estadoCivil.id} value={estadoCivil.id.toString()}>{estadoCivil.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                {...register("fechaNacimiento", {
                  required: "Este campo es requerido",
                  validate: value => {
                    const date = new Date(value);
                    const now = new Date();
                    return date < now || "La fecha de nacimiento no puede ser en el futuro";
                  }
                })} />
              {errors.fechaNacimiento && <span className="text-red-500 text-sm">{errors.fechaNacimiento.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dpi">DPI</Label>
              <Input
                id="dpi"
                {...register("dpi", {
                  required: "Este campo es requerido",
                  maxLength: { value: 20, message: "Máximo 20 caracteres" },
                  pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" }
                })} />
              {errors.dpi && <span className="text-red-500 text-sm">{errors.dpi.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                {...register("nit", {
                  maxLength: { value: 20, message: "Máximo 20 caracteres" },
                  pattern: { value: /^[0-9-]+$/, message: "Formato de NIT inválido" }
                })} />
              {errors.nit && <span className="text-red-500 text-sm">{errors.nit.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afilicacionIGGS">Afiliación IGGS</Label>
              <Input
                id="afilicacionIGGS"
                {...register("afilicacionIGGS", { maxLength: 20 })} />
              {errors.afilicacionIGGS && <span className="text-red-500 text-sm">{errors.afilicacionIGGS.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afiliacionIRTRA">Afiliación IRTRA</Label>
              <Input
                id="afiliacionIRTRA"
                {...register("afiliacionIRTRA", { maxLength: 20 })} />
              {errors.afiliacionIRTRA && <span className="text-red-500 text-sm">{errors.afiliacionIRTRA.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroPassaporte">Número de Pasaporte</Label>
              <Input
                id="numeroPassaporte"
                {...register("numeroPassaporte", { maxLength: 20 })} />
              {errors.numeroPassaporte && <span className="text-red-500 text-sm">{errors.numeroPassaporte.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                {...register("direccion", { required: "Este campo es requerido" })} />
              {errors.direccion && <span className="text-red-500 text-sm">{errors.direccion.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroTelefono">Número de Teléfono</Label>
              <Input
                id="numeroTelefono"
                {...register("numeroTelefono", {
                  required: "Este campo es requerido",
                  pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" }
                })} />
              {errors.numeroTelefono && <span className="text-red-500 text-sm">{errors.numeroTelefono.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Este campo es requerido",
                  pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
                })} />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salario">Salario</Label>
              <Input
                id="salario"
                type="number"
                step="0.01"
                {...register("salario", {
                  required: "Este campo es requerido",
                  min: { value: 0, message: "El salario debe ser mayor o igual a 0" }
                })} />
              {errors.salario && <span className="text-red-500 text-sm">{errors.salario.message}</span>}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Agregar Empleado"}
          </Button>
        </form>
      </CardContent>
    </Card><Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Registro de Empleado</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea agregar este empleado?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSubmit} disabled={isLoading}>
              {isLoading ? "Agregando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog></>
  );
};

export default EmployeeForm;

