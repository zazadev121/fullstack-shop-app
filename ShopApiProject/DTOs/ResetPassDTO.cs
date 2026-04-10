namespace ShopApiProject.DTOs
{
    public class ResetPassDTO
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string ResetCode { get; set; }
    }
}
