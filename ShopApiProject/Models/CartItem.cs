namespace ShopApiProject.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        //Relationships To other tables
        public User User { get; set; }
        public Product Product { get; set; }
    }
}
