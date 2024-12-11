using EmpleadosAPI.Data;
using EmpleadosAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;


namespace EmpleadosAPI.Services
{

    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        public AuthService(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<Usuario?> RegistrarAsync(string username, string password, int rolId)
        {
            if (await _context.Users.AnyAsync(u => u.Username == username)) {

                return null;

            }

            // Generar el hash de la contraseña
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new Usuario
            {
                Username = username,
                PasswordHash = passwordHash,
                RolId = rolId,
                IsActive = false
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;


        }

        public async Task<string?> AuthenticateAsync(string username, string password)
        {
            var user = await _context.Users
                .Include(u => u.Rol)
                .SingleOrDefaultAsync(u => u.Username == username);
           
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash) || !user.IsActive)
            {
                return null;
            }
            return _jwtService.GenerateToken(user);
        }

        public async Task<bool> ActivarUsuarioAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.IsActive= true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DesactivarUsuarioAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Usuario>> GetAllUsersAsync()
        {
            return await _context.Users.Include(u => u.Rol).ToListAsync();
        }

        public async Task<List<Rol>> GetAllRolesAsync()
        {
            return await _context.Roles.ToListAsync();
        }
    }
}
