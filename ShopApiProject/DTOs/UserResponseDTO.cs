using ShopApiProject.Enums;

namespace ShopApiProject.DTOs
{
    public class UserResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool IsVerified { get; set; }
        public string VerifyCode { get; set; }
        public UserRoles Role { get; set; } = UserRoles.User;
    }
}
