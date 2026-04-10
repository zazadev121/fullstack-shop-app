namespace ShopApiProject.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        //Relationships To other tables

        public Order Order { get; set; }
        public Product Product { get; set; }
    }
}
