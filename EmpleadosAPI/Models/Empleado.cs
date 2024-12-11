using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace EmpleadosAPI.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public required string PrimerNombre { get; set; }

        [Required]
        [StringLength(100)]
        public required string SegundoNombre { get; set; }

        [Required]
        [StringLength(50)]
        public required string Apellido { get; set; }

        [Required]

        public int GeneroId { get; set; }

        public int? EstadoCivilId { get; set; }


        [Required]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [StringLength(20)]
        public required string DPI { get; set; }

        [StringLength(20)]
        public string? NIT { get; set; }

        [StringLength(20)]
        public string? AfilicacionIGGS{ get; set; }

        [StringLength(20)]
        public string? AfiliacionIRTRA { get; set; }

        [StringLength(20)]
        public string? NumeroPassaporte { get; set; }

        [Required]
        public required string Direccion { get; set; }

        [Required]
        [Phone]
        public required string NumeroTelefono { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public decimal Salario { get; set; }


    }
}
