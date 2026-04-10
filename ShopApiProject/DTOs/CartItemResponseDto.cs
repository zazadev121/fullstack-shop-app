namespace ShopApiProject.DTOs
{
    public class CartItemResponseDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public CartProductDto Product { get; set; }
    }

    public class CartProductDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsDiscounted { get; set; }
        public int? DiscountPercentage { get; set; }
    }
}
