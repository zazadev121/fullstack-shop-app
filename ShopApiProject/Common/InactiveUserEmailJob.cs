using Hangfire;
using Microsoft.EntityFrameworkCore;
using ShopApiProject.Data;

namespace ShopApiProject.Common
{
    public class InactiveUserEmailJob
    {
        private readonly DataContext _db;
        private readonly SMTPService _smtp;
        private readonly ILogger<InactiveUserEmailJob> _logger;

        public InactiveUserEmailJob(DataContext db, SMTPService smtp, ILogger<InactiveUserEmailJob> logger)
        {
            _db = db;
            _smtp = smtp;
            _logger = logger;
        }

        public async Task Execute()
        {
            var cutoff = DateTime.Now.AddMinutes(-1);

            var inactiveUsers = await _db.Users
                .Where(u => u.LastLogIn != null && u.LastLogIn < cutoff)
                .ToListAsync();

            _logger.LogInformation("InactiveUserJob: {Count} inactive users found", inactiveUsers.Count);

            foreach (var user in inactiveUsers)
            {
                _smtp.SendEmail(
                    "We miss you at CartCore 🛍️",
                    $"Hey {user.Name},<br/><br/>You haven't logged in for over a week. Come back and see what's new!",
                    user.Email
                );
            }
        }
    }
}