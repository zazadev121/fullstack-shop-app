using ShopApiProject.Enums;

namespace ShopApiProject.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public bool IsVerified { get; set; } 
        public string VerifyCode { get; set; }
        public UserRoles Role { get; set; } = UserRoles.User;
        public DateTime? LastLogIn { get; set; }

        //Relationships To other tables

        //relation to Usercart
        public List<CartItem> UserCarts { get; set; } = new List<CartItem>();

        // relation to Orders

        public List<Order> Orders { get; set; } = new List<Order>();

        // Relation to UserWhishList
        public List<UserWhishList> UserWhishLists { get; set; } = new List<UserWhishList>();


    }
}
