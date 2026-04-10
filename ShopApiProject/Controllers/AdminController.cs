using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopApiProject.DTOs;
using ShopApiProject.Enums;
using ShopApiProject.Services.AdminService;

namespace ShopApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _AdminServ;
        public AdminController(IAdminService AdminServ) => _AdminServ = AdminServ;



        //Get Methods With Authorize For Admin Only
        [HttpGet("categories")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllCategories()
        {
            var response = _AdminServ.GetAllCategories();
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("Allusers")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var response = _AdminServ.GetAllUsers();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("UserById/{UserId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetUserById(int UserId)
        {
            var response = _AdminServ.GetUserById(UserId);
            return StatusCode(response.StatusCode, response);
        }



        [HttpGet("AllOrders")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllOrders()
        {
            var response = _AdminServ.GetAllOrders();
            return StatusCode(response.StatusCode, response);
        }
        [HttpGet("OrderById/{OrderId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetOrderById(int OrderId)
        {
            var response = _AdminServ.GetOrderById(OrderId);
            return StatusCode(response.StatusCode, response);
        }



        [HttpGet("DiscountedProducts")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllDiscountedProducts()
        {
            var response = _AdminServ.GetAllDiscountedProducts();
            return StatusCode(response.StatusCode, response);
        }


        [HttpGet("GetToTalRevenue")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetTotalRevenue()
        {
            var response = _AdminServ.GetTotalRevenue();
            return StatusCode(response.StatusCode, response);
        }


        [HttpGet("MostSoldProducts/{avgstockNum}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetMostSoldProducts(int avgstockNum)
        {
            var response = _AdminServ.GetMostSoldProducts(avgstockNum);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("LowStockProduct/{lowStockThreshold}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetLowStockProducts(int lowStockThreshold)
        {
            var response = _AdminServ.GetLowStockProducts(lowStockThreshold);
            return StatusCode(response.StatusCode, response);
        }



        //Delete Methods With Authorize For Admin Only
        [HttpDelete("DeleteProduct/{ProductId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteProduct(int ProductId)
        {
            var response = _AdminServ.DeleteProduct(ProductId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("DeleteCategory/{CategoryId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteCategory(int CategoryId)
        {
            var response = _AdminServ.DeleteCategory(CategoryId);
            return StatusCode(response.StatusCode, response);
        }
        [HttpDelete("DeleteUser/{UserId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(int UserId)
        {
            var response = _AdminServ.DeleteUser(UserId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("RemoveDiscount/{ProductId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult RemoveDiscount(int ProductId)
        {
            var response = _AdminServ.RemoveDiscount(ProductId);
            return StatusCode(response.StatusCode, response);
        }



        //Put  Methods With Authorize For Admin Only
        [HttpPut("UpdateProduct/{ProductId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateProduct(int ProductId, UpdateProductDTO req)
        {
            var response = _AdminServ.UpdateProduct(ProductId, req);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("UpdateCategory/{CategoryId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateCategory(int CategoryId, UpdateCategory req)
        {
            var response = _AdminServ.UpdateCategory(CategoryId, req);
            return StatusCode(response.StatusCode, response);
        }


        [HttpPut("ChangeUserRole/{UserId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult ChangeUserRole(int UserId, UserRoles newRole)
        {
            var response = _AdminServ.ChangeUserRole(UserId, newRole);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("UpdateOrderStatus/{OrderId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateOrderStatus(int OrderId, OrderStatus newStatus)
        {
            var response = _AdminServ.UpdateOrderStatus(OrderId, newStatus);
            return StatusCode(response.StatusCode, response);
        }




        //PostMethods With Authorize For Admin Only

        [HttpPost("CreateProduct")]
        [Authorize(Roles ="Admin")]
        public IActionResult CreateProduct(CreateProductDTO req)
        {
            var response = _AdminServ.CreateProduct(req);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("CreateCategory")]
        [Authorize(Roles ="Admin")]
        public IActionResult CreateCategory(CreateCategoryDTO req)
        {
            var response = _AdminServ.CreateCategory(req);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("AddDiscount/{ProductId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddDiscount(int ProductId, int discountPercentage)
        {
            var response = _AdminServ.AddDiscount(ProductId, discountPercentage);
            return StatusCode(response.StatusCode, response);
        }

       
    }

}