using ShopApiProject.Common;
using ShopApiProject.DTOs;
using ShopApiProject.Models;

namespace ShopApiProject.Services.UserService
{
    public interface IUserService
    {

        //Cart Methods CRUD 
        public Result<string> AddToCart(int UserId,int ProductId);
        public Result<string> RemoveFromCart(int UserId,int ProductId);
        public Result<List<CartItemResponseDto>> ShowUserCart(int UserId);
        public Result<string> UpdateUserCart(int UserId, UpdateCartDTO req);


        //Searching/GetProduct Methods 
        public Result<List<Product>> SearchProducts(string KeyWord);
        public Result<List<Product>> GetAllProducts();
        public Result<Product> GetProductById(int ProductId);

        //OrderMethods CRUD \ {Update}
        public Result<string> CreateOrder(int UserId);
        public Result<List<DetailedOrderResponseDTO>> GetUserOrders(int UserId);
        public Result<string> DeleteOrder(int UserId, int OrderId);


        //Filtering methods
        public Result<List<Product>> FilterByPrice(decimal minPrice);
        public Result<List<Product>> FilterByCategory(int categoryId);
        public Result<List<Product>> FilterByStock();
        public Result<List<Product>> FilterByDiscount();

        //WhishList Methods CRUD \{Edit}
        public Result<string> AddToWhishList(int UserId, int ProductId);
        public Result<string> RemoveFromWhishList(int UserId, int ProductId);
        public Result<List<GetProductDTO>> ShowUserWhishList(int UserId);




    }
}
