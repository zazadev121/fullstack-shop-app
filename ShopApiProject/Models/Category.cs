namespace ShopApiProject.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }

        //relation to mf Products
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
