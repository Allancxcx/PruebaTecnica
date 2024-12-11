using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EmpleadosAPI.Models;
using EmpleadosAPI.Services;


namespace EmpleadosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }
        [HttpOptions("login")]
        public IActionResult PreflightRoute()
        {
            return NoContent();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegistrarAsync(model.Username, model.Password, model.RolId);
            if (result == null)
            {
                return BadRequest("Usuario ya se encuentra registrado");
            }
            return Ok("Usuario registrado correctamente");
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var token = await _authService.AuthenticateAsync(model.Username, model.Password);
            if (token == null)
            {
                return Unauthorized();
            }
            return Ok(new { Token = token });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("activate/{userId}")]
        public async Task<IActionResult> ActivateUser(int userId)
        {
            var result = await _authService.ActivarUsuarioAsync(userId);
            if (!result)
            {
                return NotFound();
            }
            return Ok("Usuario activado correctamente");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("deactivate/{userId}")]
        public async Task<IActionResult> DeactivateUser(int userId)
        {
            var result = await _authService.DesactivarUsuarioAsync(userId);
            if (!result)
            {
                return NotFound();
            }
            return Ok("Usuario desactivado correctamente");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _authService.GetAllRolesAsync();
            return Ok(roles);
        }
    }
}
