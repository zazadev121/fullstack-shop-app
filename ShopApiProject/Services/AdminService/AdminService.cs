using ShopApiProject.Common;
using ShopApiProject.Data;
using ShopApiProject.DTOs;
using ShopApiProject.Enums;
using ShopApiProject.Models;
using Microsoft.EntityFrameworkCore;

namespace ShopApiProject.Services.AdminService
{
    public class AdminService : IAdminService
    {
        private readonly DataContext _db;
        public AdminService(DataContext db)
        {
            _db = db;
        }



        public Result<string> AddDiscount(int productId, int discountPercentage)
        {
           var product = _db.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null)
            {
                return Result<string>.NotFound("Product not found.");
            }
            if (discountPercentage < 0 || discountPercentage > 100)
            {
                return Result<string>.BadRequest("Invalid discount percentage.");
            }
            product.DiscountPercentage = discountPercentage;
            product.isDiscounted = true;
            _db.SaveChanges();
            return Result<string>.Ok("Discount added successfully.");
        }

        public Result<string> ChangeUserRole(int userId, UserRoles newRole)
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return Result<string>.NotFound("User not found.");
            }
            user.Role = newRole;
            _db.SaveChanges();
            return Result<string>.Ok("User role updated successfully.");
        }

        public Result<string> CreateCategory(CreateCategoryDTO req)
        {
            if (string.IsNullOrWhiteSpace(req.Name)
                || _db.Categories.Any(c => c.Name.ToLower() == req.Name.ToLower()))
            {
                return Result<string>.BadRequest("Invalid or duplicate category name.");
            }
            Category newCategory = new Category
            {
                Name = req.Name
            };
            _db.Categories.Add(newCategory);
            _db.SaveChanges();
            return Result<string>.Ok("Category created successfully.");
        }

        public Result<string> CreateProduct(CreateProductDTO req)
        {
            if (string.IsNullOrWhiteSpace(req.Name))
                return Result<string>.BadRequest("Product name is required.");
            if (req.Price < 0)
                return Result<string>.BadRequest("Price cannot be negative.");
            if (req.CategoryId <= 0 || !_db.Categories.Any(c => c.Id == req.CategoryId))
                return Result<string>.BadRequest("Invalid category ID.");
            if(string.IsNullOrWhiteSpace(req.Description))
                return Result<string>.BadRequest("Product description is required.");
            if(string.IsNullOrWhiteSpace(req.ImageUrl))
                return Result<string>.BadRequest("Product image URL is required.");
            if(req.Stock < 0)
                return Result<string>.BadRequest("Stock cannot be negative.");

            Product newProduct = new Product
                {
                Name = req.Name,
                Description = req.Description,
                Price = req.Price,
                ImageUrl = req.ImageUrl,
                Stock = req.Stock,
                CategoryId = req.CategoryId
            };
            _db.Products.Add(newProduct);
            _db.SaveChanges();
            return Result<string>.Ok("Product created successfully.");



        }

        public Result<string> DeleteCategory(int categoryId)
        {
            var category = _db.Categories.FirstOrDefault(c => c.Id == categoryId);
            if (category == null)
            {
                return Result<string>.NotFound("Category not found.");
            }
            if (_db.Products.Any(p => p.CategoryId == category.Id))
            {
                return Result<string>.BadRequest("Cannot delete category with associated products.");
            }
            _db.Categories.Remove(category);
            _db.SaveChanges();
            return Result<string>.Ok("Category deleted successfully.");
        }

        public Result<string> DeleteProduct(int productId)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null)
            {
                return Result<string>.NotFound("Product not found.");
            }
            if (_db.OrderItems.Any(oi => oi.ProductId == productId))
            {
                return Result<string>.BadRequest("Cannot delete product associated with orders.");
            }
            _db.Products.Remove(product);
            _db.SaveChanges();
            return Result<string>.Ok("Product deleted successfully.");


        }

        public Result<string> DeleteUser(int userId)
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return Result<string>.NotFound("User not found.");
            }
            if (_db.Orders.Any(o => o.UserId == userId))
            {
                return Result<string>.BadRequest("Cannot delete user with existing orders.");
            }
            _db.Users.Remove(user);
            _db.SaveChanges();
            return Result<string>.Ok("User deleted successfully.");

        }

        public Result<List<CategoryResponseDTO>> GetAllCategories()
        {
            List<CategoryResponseDTO> categories
                = _db.Categories.Select(c => new CategoryResponseDTO
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();
            return Result<List<CategoryResponseDTO>>.Ok(categories);
        }

        public Result<List<GetProductDTO>> GetAllDiscountedProducts()
        {
            List<GetProductDTO> DiscountedProducts = _db.Products.Where(p => p.isDiscounted == true)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    isDiscounted = p.isDiscounted,
                    DiscountPercentage = p.DiscountPercentage
                }).ToList();
            return Result<List<GetProductDTO>>.Ok(DiscountedProducts);
        }

        public Result<List<OrderResponseDTO>> GetAllOrders()
        {
            List<OrderResponseDTO> orders = _db.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Select(o => new OrderResponseDTO
                { 
                    Id = o.Id,
                    UserId = o.UserId,
                    UserName = o.User.Name,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        Price = oi.Product.Price
                    }).ToList()
                }).ToList();
            return Result<List<OrderResponseDTO>>.Ok(orders);

        }

        public Result<List<UserResponseDTO>> GetAllUsers()
        {
            List<UserResponseDTO> users = _db.Users.Select(u => new UserResponseDTO
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                IsVerified = u.IsVerified,
                Role = u.Role
            }).ToList();
            return Result<List<UserResponseDTO>>.Ok(users);
        }

        public Result<List<GetProductDTO>> GetLowStockProducts(int stockThreshold)
        {
            List<GetProductDTO> LowStockProducts = _db.Products.Where(p => p.Stock < stockThreshold)
                .Select(p => new GetProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    isDiscounted = p.isDiscounted,
                    DiscountPercentage = p.DiscountPercentage
                }).ToList();
            return Result<List<GetProductDTO>>.Ok(LowStockProducts);
        }

        public Result<List<GetProductDTO>> GetMostSoldProducts(int avgstockNum)
        {
            var mostSoldProducts = _db.OrderItems
                .GroupBy(oi => oi.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalSold = g.Sum(oi => oi.Quantity)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(avgstockNum)
                .Join(_db.Products, x => x.ProductId, p => p.Id, (x, p) => new GetProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    CategoryId = p.CategoryId,
                    isDiscounted = p.isDiscounted,
                    DiscountPercentage = p.DiscountPercentage
                }).ToList();
            return Result<List<GetProductDTO>>.Ok(mostSoldProducts);
        }

        public Result<DetailedOrderResponseDTO> GetOrderById(int orderId)
        {
            var detailedOrder = _db.Orders.Where(o => o.Id == orderId)
                .Select(o => new DetailedOrderResponseDTO
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        ProductId = oi.ProductId,
                        Quantity = oi.Quantity,
                        ProductName = oi.Product.Name,
                        Price = oi.Product.Price
                    }).ToList()
                }).FirstOrDefault();

            if (detailedOrder == null)
            {
                return Result<DetailedOrderResponseDTO>.NotFound("Order not found");
            }

            return Result<DetailedOrderResponseDTO>.Ok(detailedOrder);
        }

        public Result<decimal> GetTotalRevenue()
        {
            var totalRevenue = _db.Orders.Sum(o => o.TotalAmount);
            return Result<decimal>.Ok(totalRevenue);
        }

        public Result<UserResponseDTO> GetUserById(int userId)
        {
            var user = _db.Users.Where(u => u.Id == userId)
                .Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    IsVerified = u.IsVerified,
                    VerifyCode = u.VerifyCode,
                    Role = u.Role
                }).FirstOrDefault();

            if (user == null)
            {
                return Result<UserResponseDTO>.NotFound("User not found");
            }

            return Result<UserResponseDTO>.Ok(user  );
        }

        public Result<string> RemoveDiscount(int productId)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null)
            {
                return Result<string>.NotFound("Product not found.");
            }
            product.DiscountPercentage = null;
            product.isDiscounted = false;
            _db.SaveChanges();
            return Result<string>.Ok("Discount removed successfully.");

        }

        public Result<string> UpdateCategory(int categoryId, UpdateCategory req)
        {
            var category = _db.Categories.FirstOrDefault(c => c.Id == categoryId);
            if (category == null)
            {
                return Result<string>.NotFound("Category not found.");
            }
            if (!string.IsNullOrWhiteSpace(req.Name))
            {
                if (_db.Categories.Any(c => c.Name.ToLower() == req.Name.ToLower() && c.Id != categoryId))
                {
                    return Result<string>.BadRequest("Duplicate category name.");
                }
                category.Name = req.Name;
            }
            _db.SaveChanges();
            return Result<string>.Ok("Category updated successfully.");

        }

        public Result<string> UpdateOrderStatus(int orderId, OrderStatus newStatus)
        {
            var order = _db.Orders.FirstOrDefault(o => o.Id == orderId);
            if (order == null)
            {
                return Result<string>.NotFound("Order not found.");
            }
            order.Status = newStatus;
            _db.SaveChanges();
            return Result<string>.Ok("Order status updated successfully.");

        }

        public Result<string> UpdateProduct(int ProductId,UpdateProductDTO req)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == ProductId);
            if (product == null)
            {
                return Result<string>.NotFound("Product not found.");
            }
            if (!string.IsNullOrWhiteSpace(req.Name))
                product.Name = req.Name;
            if (!string.IsNullOrWhiteSpace(req.Description))
                product.Description = req.Description;
            if (!string.IsNullOrWhiteSpace(req.ImageUrl))
                product.ImageUrl = req.ImageUrl;
            if (req.Price.HasValue)
                {
                if (req.Price.Value < 0)
                    return Result<string>.BadRequest("Price cannot be negative.");
                product.Price = req.Price.Value;
            }
            if (req.Stock.HasValue)
            {
                if (req.Stock.Value < 0)
                    return Result<string>.BadRequest("Stock cannot be negative.");
                product.Stock = req.Stock.Value;
            }
            if (req.CategoryId.HasValue)
            {
                if (!_db.Categories.Any(c => c.Id == req.CategoryId.Value))
                    return Result<string>.BadRequest("Invalid category ID.");
                product.CategoryId = req.CategoryId.Value;
            }
            _db.SaveChanges();
            return Result<string>.Ok("Product updated successfully.");

        }
    }
}
