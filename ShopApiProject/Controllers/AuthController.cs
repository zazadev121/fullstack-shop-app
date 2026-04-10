using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopApiProject.DTOs;
using ShopApiProject.Services.AuthsService;

namespace ShopApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("Register")]
        public IActionResult Register(RegisterDTO request)
        {
            var response = _authService.Register(request);
            return StatusCode(response.StatusCode,response);
        }
        [HttpPost("Login")]
        public IActionResult Login(LoginDTO request)
        {
            var response = _authService.Login(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("VerifyEmail")]
        public IActionResult VerifyEmail(VerifyEmailDTO request)
        {
            var response = _authService.VerifyEmail(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("ForgotPassword/{Email}")]
        public IActionResult ForgotPassword(string Email)

        {
            var response = _authService.ForgotPassword(Email);
            return StatusCode(response.StatusCode, response);
        }
            [HttpPost("ResetPassword")]
            public IActionResult ResetPassword(ResetPassDTO req)
        {
            var response = _authService.ResetPassword(req);
            return StatusCode(response.StatusCode, response);
        }


    }
}
