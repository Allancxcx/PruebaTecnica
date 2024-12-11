import Link from "next/link"
import { Button } from "@/Components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          Sistema de Control de Empleados
        </h1>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/login">
            <Button className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
              Registrarse
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}