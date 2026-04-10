using ShopApiProject.Enums;

namespace ShopApiProject.DTOs
{
    public class DetailedOrderResponseDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public List<OrderItemResponseDTO> OrderItems { get; set; } = new List<OrderItemResponseDTO>();
    }
}
