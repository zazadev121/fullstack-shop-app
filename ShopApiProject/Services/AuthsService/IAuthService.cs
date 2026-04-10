using ShopApiProject.Common;
using ShopApiProject.DTOs;

namespace ShopApiProject.Services.AuthsService
{
    public interface IAuthService
    {
        public Result<int> Register(RegisterDTO req);
        public Result<string> Login(LoginDTO req);
        public Result<string> VerifyEmail(VerifyEmailDTO req);
        public Result<string> ResetPassword(ResetPassDTO req);
        public Result<string> ForgotPassword(string Email);
    }
}
