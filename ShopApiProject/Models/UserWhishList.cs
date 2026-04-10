namespace ShopApiProject.Models
{
    public class UserWhishList
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        //Relationships To other tables
        public User User { get; set; }
        public Product Product { get; set; }

    }
}
