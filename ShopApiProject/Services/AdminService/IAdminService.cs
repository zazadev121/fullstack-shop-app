using ShopApiProject.Common;
using ShopApiProject.DTOs;
using ShopApiProject.Enums;
using System.Collections.Generic;

namespace ShopApiProject.Services.AdminService
{
    public interface IAdminService
    {
        // Products CRUD

        //- CreateProduct 
        public Result<string> CreateProduct(CreateProductDTO req);
        //- UpdateProduct  
        public Result<string> UpdateProduct(int ProductId, UpdateProductDTO req);
        //- DeleteProduct
        public Result<string> DeleteProduct(int productId);

        //// Categories CRUD
        //- CreateCategory
        public Result<string> CreateCategory(CreateCategoryDTO req);


        //- UpdateCategory
        public Result<string> UpdateCategory(int categoryId, UpdateCategory req);
        //- DeleteCategory
        public Result<string> DeleteCategory(int categoryId);
        //- GetAllCategories
        public Result<List<CategoryResponseDTO>> GetAllCategories();

        //// User Management
        //- GetAllUsers
        public Result<List<UserResponseDTO>> GetAllUsers();
        //- GetUserById
        public Result<UserResponseDTO> GetUserById(int userId);
        //- DeleteUser
        public Result<string> DeleteUser(int userId);
        //- ChangeUserRole
        public Result<string> ChangeUserRole(int userId, UserRoles newRole);
        //- GetAllOrders(all users)
        public Result<List<OrderResponseDTO>> GetAllOrders();
        //- GetOrderById
        public Result<DetailedOrderResponseDTO> GetOrderById(int orderId);
        //- UpdateOrderStatus(Pending → Shipped)
        public Result<string> UpdateOrderStatus(int orderId, OrderStatus newStatus);

        //// Discounts
        //- AddDiscount(set isDiscounted + DiscountPercentage on a product)
        public Result<string> AddDiscount(int productId, int discountPercentage);
        //- RemoveDiscount
        public Result<string> RemoveDiscount(int productId);
        //- GetAllDiscountedProducts
        public Result<List<GetProductDTO>> GetAllDiscountedProducts();

        
        //- GetTotalRevenue
        public Result<decimal> GetTotalRevenue();

        //- GetMostSoldProducts
        public Result<List<GetProductDTO>> GetMostSoldProducts(int avgstockNum);
        //- GetLowStockProducts(stock<X)
        public Result<List<GetProductDTO>> GetLowStockProducts(int stockThreshold);
        
    }
}
