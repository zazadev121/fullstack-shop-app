using System.Net;
using System.Net.Mail;

namespace ShopApiProject.Common
{
    public class SMTPService
    {
        private readonly string _email = "cheshmaritashvilizaza@gmail.com";
        private readonly string _password = "zume cnga jzzq amyn";

        public void SendEmail(string subject, string body, string email)
        {
            string logoPath = @"c:\Users\Home\OneDrive\Desktop\thing\fullstackapp\frontend\public\logo.png";
            string logoCid = "cartcore_logo";
            
            string htmlBody = $@"<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <style>
        body {{ margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f6f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }}
        img {{ border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }}
        table {{ border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
        .wrapper {{ width: 100%; background-color: #f6f7fb; padding: 40px 0; }}
        .container {{ width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 15px 45px rgba(0,0,0,0.06); }}
        .header {{ background: linear-gradient(60deg, #6c63ff 0%, #f472b6 100%); padding: 45px 20px; text-align: center; color: #ffffff; }}
        .logo-img {{ height: 50px; width: auto; margin-bottom: 15px; border-radius: 10px; }}
        .content {{ padding: 45px; text-align: center; color: #1e1e2d; }}
        .code-container {{ background: #f8f8ff; border: 2.5px dashed #a5b4fc; border-radius: 16px; padding: 30px; margin: 30px 0; display: inline-block; width: 85%; }}
        .code-value {{ font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; color: #4f46e5; letter-spacing: 12px; margin: 0; line-height: 1; }}
        .code-label {{ font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; }}
        .button {{ display: inline-block; padding: 16px 36px; background: linear-gradient(60deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 20px rgba(79,70,229,0.3); }}
        .footer {{ padding: 30px 20px; text-align: center; color: #94a3b8; font-size: 14px; line-height: 1.5; }}
        h1 {{ font-size: 26px; font-weight: 900; margin: 0 0 15px; letter-spacing: -0.5px; }}
        @media only screen and (max-width: 620px) {{
            .container {{ border-radius: 0 !important; width: 100% !important; }}
            .content {{ padding: 35px 25px !important; }}
            .code-value {{ font-size: 32px !important; letter-spacing: 8px !important; }}
            .wrapper {{ padding: 0 !important; }}
        }}
    </style>
</head>
<body>
    <div class='wrapper'>
        <table class='container' cellpadding='0' cellspacing='0'>
            <tr>
                <td class='header'>
                    <img src='cid:{logoCid}' alt='CartCore Logo' class='logo-img'>
                    <div style='font-size: 26px; font-weight: 900; letter-spacing: -1.5px; opacity: 0.95;'>CARTCORE</div>
                </td>
            </tr>
            <tr>
                <td class='content'>
                    <h1>{subject}</h1>
                    <p style='font-size: 17px; margin-bottom: 10px;'>Hello from TaskCore Team!</p>
                    <p style='font-size: 15px; color: #64748b; margin: 0;'>Your security protocol has generated a unique access token for you.</p>
                    
                    <div class='code-container'>
                        <div class='code-label'>Secure Access Code</div>
                        <div class='code-value'>{body.Replace("Code : ", "").Replace("Your verification code is: ", "")}</div>
                    </div>
                    
                    <p style='font-size: 14px; color: #94a3b8; margin-bottom: 30px;'>For your safety, do not share this code with anyone else.</p>
                    <a href='#' class='button'>Explore the Shop</a>
                </td>
            </tr>
            <tr>
                <td class='footer'>
                    <strong>&copy; 2026 CartCore Marketplace</strong><br>
                    Redefining the shopping experience with speed and security.<br>
                    <span style='font-size: 12px; margin-top: 10px; display: block;'>You received this because of a secure action on your account.</span>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>";

            using var mail = new MailMessage();
            mail.From = new MailAddress(_email, "CartCore");
            mail.IsBodyHtml = true;
            mail.Subject = subject;
            mail.To.Add(email);
            
            // Embed Logo using LinkedResource
            AlternateView av = AlternateView.CreateAlternateViewFromString(htmlBody, null, "text/html");
            if (File.Exists(logoPath))
            {
                LinkedResource logo = new LinkedResource(logoPath);
                logo.ContentId = logoCid;
                av.LinkedResources.Add(logo);
            }
            mail.AlternateViews.Add(av);

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential(_email, _password),
            };

            smtpClient.Send(mail);
        }
    }
}