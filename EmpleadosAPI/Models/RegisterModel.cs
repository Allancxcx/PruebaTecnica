using System.ComponentModel.DataAnnotations;

namespace EmpleadosAPI.Models
{
    public class RegisterModel
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Selecciona un rol valido")]
        public int RolId { get; set; }
    }
}
