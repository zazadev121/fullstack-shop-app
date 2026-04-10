using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using ShopApiProject.Common;
using ShopApiProject.Data;
using ShopApiProject.DTOs;
using ShopApiProject.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShopApiProject.Services.AuthsService
{
    public class AuthService : IAuthService
    {
        private readonly SMTPService _smtp;
        private readonly IConfiguration _configuration;
        private readonly DataContext _db;
        public AuthService(SMTPService smtp, IConfiguration configuration,DataContext db)
        {
            _smtp = smtp;
            _configuration = configuration;
            _db = db;

        }


        public Result<string> ForgotPassword(string Email)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == Email);
            if (user == null)
                return Result<string>.BadRequest("Inccorect Credientials");
            Random ran = new Random();



            var code = ran.Next(100_000, 999_999);

            user.VerifyCode = code.ToString();
            _db.SaveChanges();
            _smtp.SendEmail("Password Reset Code", $"Code : {user.VerifyCode}", user.Email);
            return Result<string>.Ok("Email Sent");


            



        }

        public Result<string> Login(LoginDTO req)
        {
            var user = _db.Users
                 .FirstOrDefault(u => u.Email == req.Email);

            if (user == null)
                return Result<string>.BadRequest("incorrect info.");

            if (!BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
                return Result<string>.BadRequest("incorrect Password.");
            if (!user.IsVerified)
                return Result<string>.BadRequest("User Should Verify First");

            var token = GenerateJwtToken(user);
            user.LastLogIn = DateTime.UtcNow;
            _db.SaveChanges();

            return Result<string>.Ok(token);




        }

        public Result<int> Register(RegisterDTO req)
        {
            if (req.Email == null)
                return Result<int>.BadRequest("Email is required");
            if (req.Password == null)
                return Result<int>.BadRequest("Password is required");
            if(req.Name == null)
                return Result<int>.BadRequest("Name is required");

            Random ran = new Random();
            string Code = ran.Next(100_000, 999_999).ToString();

            User user = new User
            {
                Name = req.Name,
                Email = req.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(req.Password),
                VerifyCode = Code,
            };

            _db.Users.Add(user);
            _db.SaveChanges();
            _smtp.SendEmail("Verify your email" , $"Your verification code is: {Code}" , user.Email);
            return Result<int>.Ok(user.Id);
        }

        public Result<string> ResetPassword(ResetPassDTO req)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == req.Email);

            if (user == null)
                return Result<string>.BadRequest("Inccorect crenidentials");
            if (user.VerifyCode != req.ResetCode)
                return Result<string>.BadRequest("Incorrect Code");
            user.Password = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            _db.SaveChanges();

            return Result<string>.Ok(user.Id.ToString());

            
        }

        public Result<string> VerifyEmail(VerifyEmailDTO req)
        { 
            var user = _db.Users
                 .FirstOrDefault(u => u.Email == req.Email);

            if (user == null)
                return Result<string>.NotFound("user not found.");

            if (user.VerifyCode != req.VerifyCode)
                return Result<string>.BadRequest("verification code is not correct.");

            user.IsVerified = true;
            user.VerifyCode = "";
            user.LastLogIn = DateTime.UtcNow;
            _db.SaveChanges();
            var token = GenerateJwtToken(user);
            return Result<string>.Ok(token);
        }



        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(
                securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("UserId", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
