using System.ComponentModel.DataAnnotations;
using System.Data;

namespace EmpleadosAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public required string Username { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        public int RolId { get; set; }
        public Rol Rol { get; set; } = null!;

        public bool IsActive { get; set; }

    }
}
