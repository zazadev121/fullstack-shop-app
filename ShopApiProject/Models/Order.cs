using ShopApiProject.Enums;

namespace ShopApiProject.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; } 

        //kavshrirebi orderitem tan
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public User? User { get; set; }
    }
}
