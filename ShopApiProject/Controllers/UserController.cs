using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopApiProject.Data;
using ShopApiProject.DTOs;
using ShopApiProject.Services.UserService;

namespace ShopApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private int GetUserId()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (claim == null) return 0;
            return int.Parse(claim.Value);
        }

        //Get Methods Without Authorize
        [HttpGet("GetAllProducts")]
        public IActionResult GetAllProducts()
        {
            var response = _userService.GetAllProducts();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("SearchProducts/{KeyWord}")]
        public IActionResult SearchProducts(string KeyWord)
        {
            var response = _userService.SearchProducts(KeyWord);
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("GetSingularProductById/{ProductId}")]
        public IActionResult GetSingularProductById(int ProductId)
        {
            var response = _userService.GetProductById(ProductId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("FilterByStock")]
        public IActionResult FilterByStock()
        {
            var response = _userService.FilterByStock();
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("FilterByDiscount")]
        public IActionResult FilterByDiscount()
        {
            var response = _userService.FilterByDiscount();
            return StatusCode(response.StatusCode, response);

        }

        [HttpGet("FilterByCategory/{CategoryId}")]
        public IActionResult FilterByCategory(int CategoryId)
        {
            var response = _userService.FilterByCategory(CategoryId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("FilterByPrice/{MinPrice}")]
        public IActionResult FilterByPrice(decimal MinPrice)
        {
            var response = _userService.FilterByPrice(MinPrice);
            return StatusCode(response.StatusCode, response);
        }





        //GetMethod With Authorize
        [HttpGet("ShowUserCart")]
        [Authorize]
        public IActionResult ShowUserCart()
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.ShowUserCart(UserId);
            return StatusCode(response.StatusCode, response);

        }
        [HttpGet("ShowUserOrders")]
        [Authorize]
        public IActionResult ShowUserOrders()
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.GetUserOrders(UserId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("GetUserWishlist")]
        [Authorize]
        public IActionResult GetUserWishlist()
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.ShowUserWhishList(UserId);
            return StatusCode(response.StatusCode, response);
        }




        //Delete Methods W Auth

        [HttpDelete("RemoveFromwishList/{ProductId}")]
        [Authorize]
        public IActionResult RemoveFromWishlist(int ProductId)
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.RemoveFromWhishList(UserId, ProductId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("RemoveFromCart/{ProductId}")]
        [Authorize]
        public IActionResult RemoveFromCart(int ProductId)
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.RemoveFromCart(UserId, ProductId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("DeleteOrder/{OrderId}")]
        [Authorize]
        public IActionResult DeleteOrder(int OrderId)
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.DeleteOrder(UserId, OrderId);
            return StatusCode(response.StatusCode, response);
        }

        //Put Methods W Auth

        [HttpPut("UpdateCart")]
        [Authorize]
        public IActionResult UpdateCart(UpdateCartDTO req)
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.UpdateUserCart(UserId, req);
            return StatusCode(response.StatusCode, response);
        }







        //Post Methods W Auth
        [HttpPost("AddToCart/{ProductId}")]
        [Authorize]
        public IActionResult AddToCart(int ProductId)
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.AddToCart(UserId, ProductId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("AddToWishlist/{ProductId}")]
        [Authorize]
        public IActionResult AddToWishlist(int ProductId)
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.AddToWhishList(UserId, ProductId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpPost("CreateOrder")]
        [Authorize]
        public IActionResult CreateOrder()
        {
            int UserId = GetUserId();
            if (UserId == 0) return Unauthorized();
            var response = _userService.CreateOrder(UserId);
            return StatusCode(response.StatusCode, response);

        }  
    }
}
