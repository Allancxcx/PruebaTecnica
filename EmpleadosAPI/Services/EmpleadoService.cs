using EmpleadosAPI.Data;
using EmpleadosAPI.Models;
using Microsoft.EntityFrameworkCore;


namespace EmpleadosAPI.Services
{
    public class EmpleadoService
    {
        private readonly ApplicationDbContext _context;

        public EmpleadoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Empleado>> GetAllEmpleadosAsync()
        {
            return await _context.Employees
                .ToListAsync();

               
        }

         public async Task<Empleado?> GetEmpleadosByIdAsync(int id)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e=> e.Id == id);
        }

        public async Task<Empleado> CreateEmpleadoAsync(Empleado empleado)
        {
            try
            {

                var genero = await _context.Generos.FindAsync(empleado.GeneroId);
                if (genero == null)
                {
                    throw new ArgumentException("Invalid GenderoId");
                }

             
                if (empleado.EstadoCivilId.HasValue)
                {
                    var estadoCivil = await _context.EstadoCivil.FindAsync(empleado.EstadoCivilId.Value);
                    if (estadoCivil == null)
                    {
                        throw new ArgumentException("Invalid EstadoCivilId");
                    }
                }

           
                _context.Employees.Add(empleado);
                await _context.SaveChangesAsync();

                return empleado;
            }
            catch (Exception ex)
            {

                throw ex;
            }
       



        }

        public async Task<Empleado> UpdateEmpleadoAsync(Empleado empleado)
        {
         

            _context.Entry(empleado).State= EntityState.Modified;
            await _context.SaveChangesAsync();
            return empleado;
        }

        public async Task<bool> DeleteEmpleadoAsync(int id)
        {
            var empleado = await _context.Employees.FindAsync(id);
            if (empleado == null)
            {
                return false;
            }
            _context.Employees.Remove(empleado);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<List<Genero>> GetGeneroAsync()
        {
            return await _context.Generos.ToListAsync();
        }

        public async Task<List<EstadoCivil>> GetEstadoCivil()
        {
            return await _context.EstadoCivil.ToListAsync();
        }
    }
}
