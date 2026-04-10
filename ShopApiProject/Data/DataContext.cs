using Microsoft.EntityFrameworkCore;
using ShopApiProject.Models;

namespace ShopApiProject.Data
{
    public class DataContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<CartItem> UserCarts { get; set; }
        public DbSet<UserWhishList> WishList { get; set; }



        public DataContext(DbContextOptions options) : base(options)
        {
        }

        
    }
}
