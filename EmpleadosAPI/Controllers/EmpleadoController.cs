using EmpleadosAPI.Models;
using EmpleadosAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace EmpleadosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly EmpleadoService _employeeService;

        public EmpleadoController(EmpleadoService employeeService)
        {
            _employeeService = employeeService ?? throw new ArgumentNullException(nameof(employeeService));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetAllEmployees()
        {
            try
            {
                var employees = await _employeeService.GetAllEmpleadosAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Empleado>> GetEmployee(int id)
        {
            if (id <= 0)
            {
                return BadRequest("El ID del empleado debe ser un número positivo.");
            }

            try
            {
                var employee = await _employeeService.GetEmpleadosByIdAsync(id);
                if (employee == null)
                {
                    return NotFound($"No se encontró un empleado con el ID {id}.");
                }
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Empleado>> CreateEmployee([FromBody] Empleado employee)
        {
            if (employee == null)
            {
                return BadRequest("Los datos del empleado son nulos.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdEmployee = await _employeeService.CreateEmpleadoAsync(employee);
                return CreatedAtAction(nameof(GetEmployee), new { id = createdEmployee.Id }, createdEmployee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al crear el empleado: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Empleado>> UpdateEmployee(int id, [FromBody] Empleado employee)
        {
            if (id <= 0)
            {
                return BadRequest("El ID del empleado debe ser un número positivo.");
            }

            if (employee == null)
            {
                return BadRequest("Los datos del empleado son nulos.");
            }

            if (id != employee.Id)
            {
                return BadRequest("El ID en la URL no coincide con el ID del empleado en el cuerpo de la solicitud.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedEmployee = await _employeeService.UpdateEmpleadoAsync(employee);
                if (updatedEmployee == null)
                {
                    return NotFound($"No se encontró un empleado con el ID {id}.");
                }
                return Ok(updatedEmployee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar el empleado: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            if (id <= 0)
            {
                return BadRequest("El ID del empleado debe ser un número positivo.");
            }

            try
            {
                var result = await _employeeService.DeleteEmpleadoAsync(id);
                if (!result)
                {
                    return NotFound($"No se encontró un empleado con el ID {id}.");
                }
                return Ok(new { message = "Empleado eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar el empleado: {ex.Message}");
            }
        }

        [HttpGet("genders")]
        public async Task<ActionResult<IEnumerable<Genero>>> GetAllGenders()
        {
            try
            {
                var genders = await _employeeService.GetGeneroAsync();
                return Ok(genders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los géneros: {ex.Message}");
            }
        }

        [HttpGet("maritalstatuses")]
        public async Task<ActionResult<IEnumerable<EstadoCivil>>> GetAllMaritalStatuses()
        {
            try
            {
                var maritalStatuses = await _employeeService.GetEstadoCivil();
                return Ok(maritalStatuses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los estados civiles: {ex.Message}");
            }
        }
    }
}