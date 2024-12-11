using Microsoft.EntityFrameworkCore;
using EmpleadosAPI.Models;

using System.Data;
using System.Reflection;


namespace EmpleadosAPI.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
              : base(options)
        {
        }

        public DbSet<Usuario> Users { get; set; }
        public DbSet<Empleado> Employees { get; set; }

        public DbSet<Rol> Roles {  get; set; }
        public DbSet<EstadoCivil> EstadoCivil { get; set; }
        public DbSet<Genero> Generos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Empleado>()
                .HasIndex(e => e.DPI)
                .IsUnique();

            modelBuilder.Entity<Empleado>()
                .HasIndex(e => e.Email)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
