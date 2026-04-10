using ShopApiProject.Common;
using ShopApiProject.Data;
using ShopApiProject.DTOs;
using ShopApiProject.Models;
using Microsoft.EntityFrameworkCore;
using ShopApiProject.Enums;

namespace ShopApiProject.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly DataContext _db;
        public UserService(DataContext db)
        {
            _db = db;
        }

        public Result<string> AddToCart(int UserId, int ProductId)
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == UserId);
            if (user == null)
                return Result<string>.BadRequest("No User With This Id");

            var product = _db.Products.FirstOrDefault(p => p.Id == ProductId);
            if (product == null)
                return Result<string>.BadRequest("No Product With This Id");

            if (product.Stock <= 0)
                return Result<string>.BadRequest("Product is out of stock");

            var cartItem = _db.UserCarts.FirstOrDefault(c => c.UserId == UserId && c.ProductId == ProductId);

            if (cartItem != null)
            {
                if (cartItem.Quantity + 1 > product.Stock)
                    return Result<string>.BadRequest("Not enough stock available");

                cartItem.Quantity += 1;
                _db.SaveChanges();
                return Result<string>.Ok("Product quantity updated in cart successfully");
            }

            var newCartItem = new CartItem
            {
                UserId = UserId,
                ProductId = ProductId,
                Quantity = 1
            };

            _db.UserCarts.Add(newCartItem);
            _db.SaveChanges();

            return Result<string>.Ok("Product added to cart successfully");
        }

        public Result<string> AddToWhishList(int UserId, int ProductId)
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == UserId);
            if (user == null)
                return Result<string>.BadRequest("No User With This Id");

            var product = _db.Products.FirstOrDefault(p => p.Id == ProductId);
            if (product == null)
                return Result<string>.BadRequest("No Product With This Id");

            var existingWishItem = _db.WishList.FirstOrDefault(w => w.UserId == UserId && w.ProductId == ProductId);
            if (existingWishItem != null)
                return Result<string>.BadRequest("Product already exists in wish list");

            var wishItem = new UserWhishList
            {
                UserId = UserId,
                ProductId = ProductId
            };

            _db.WishList.Add(wishItem);
            _db.SaveChanges();

            return Result<string>.Ok("Product added to wish list successfully");
        }

        public Result<string> CreateOrder(int UserId)
        {
            var user = _db.Users.FirstOrDefault(u => u.Id == UserId);
            if (user == null)
                return Result<string>.BadRequest("No User With This Id");

            var cartItems = _db.UserCarts.Where(c => c.UserId == UserId).ToList();
            if (cartItems == null || cartItems.Count == 0)
                return Result<string>.BadRequest("Cart is empty");

            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var cartItem in cartItems)
            {
                var product = _db.Products.FirstOrDefault(p => p.Id == cartItem.ProductId);
                if (product == null)
                    return Result<string>.BadRequest($"Product with Id {cartItem.ProductId} not found");

                if (product.Stock < cartItem.Quantity)
                    return Result<string>.BadRequest($"Not enough stock for {product.Name}");

                decimal itemPrice = product.Price;
                if (product.isDiscounted == true)
                {
                    itemPrice = product.Price * (1 - (product.DiscountPercentage ?? 0) / 100m);
                }

                totalAmount += itemPrice * cartItem.Quantity;

                var orderItem = new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity
                };

                orderItems.Add(orderItem);
                product.Stock -= cartItem.Quantity;
            }

            var order = new Order
            {
                UserId = UserId,
                TotalAmount = totalAmount,
                OrderItems = orderItems
            };

            _db.Orders.Add(order);
            _db.UserCarts.RemoveRange(cartItems);
            _db.SaveChanges();

            return Result<string>.Ok("Order created successfully");
        }

        public Result<string> DeleteOrder(int UserId, int OrderId)
        {
            var order = _db.Orders.FirstOrDefault(o => o.Id == OrderId && o.UserId == UserId);
            if (order == null)
                return Result<string>.BadRequest("No such order for this user");

            if (order.Status != OrderStatus.Pending)
                return Result<string>.BadRequest("Cannot cancel an order that is already shipped or delivered");

            _db.Orders.Remove(order);
            _db.SaveChanges();
            return Result<string>.Ok("Order deleted successfully");
        }

        public Result<List<Product>> FilterByCategory(int categoryId)
        {
            List<Product> Products = _db.Products.Where(p => p.CategoryId == categoryId).ToList();
            if (Products == null || Products.Count == 0)
                return Result<List<Product>>.BadRequest("No Products With This Category");
            return Result<List<Product>>.Ok(Products);
        }

        public Result<List<Product>> FilterByDiscount()
        {
            List<Product> products = _db.Products.Where(p => p.isDiscounted == true).ToList();
            if (products == null || products.Count == 0)
                return Result<List<Product>>.BadRequest("No Discounted Products Available");
            return Result<List<Product>>.Ok(products);
        }

        public Result<List<Product>> FilterByPrice(decimal minPrice)
        {
            List<Product> products = _db.Products.Where(p => p.Price >= minPrice).ToList();
            if (products == null)
                return Result<List<Product>>.BadRequest("No Products With This Price");
            return Result<List<Product>>.Ok(products);
        }

        public Result<List<Product>> FilterByStock()
        {
            List<Product> products = _db.Products.Where(p => p.Stock > 0).ToList();
            if (products == null || products.Count == 0)
                return Result<List<Product>>.BadRequest("No Products In Stock");
            return Result<List<Product>>.Ok(products);
        }

        public Result<List<Product>> GetAllProducts()
        {
            List<Product> products = _db.Products.ToList();
            return Result<List<Product>>.Ok(products);
        }

        public Result<Product> GetProductById(int ProductId)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == ProductId);
            if (product == null)
                return Result<Product>.BadRequest("No Product With This Id");
            return Result<Product>.Ok(product);
        }

        public Result<List<DetailedOrderResponseDTO>> GetUserOrders(int UserId)
        {
            var orders = _db.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == UserId)
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
                })
                .ToList();

            if (orders == null || orders.Count == 0)
                return Result<List<DetailedOrderResponseDTO>>.BadRequest("No User With This Id or No Orders For This User");

            return Result<List<DetailedOrderResponseDTO>>.Ok(orders);
        }

        public Result<string> RemoveFromCart(int UserId, int ProductId)
        {
            var cartItem = _db.UserCarts.FirstOrDefault(c => c.UserId == UserId && c.ProductId == ProductId);
            if (cartItem == null)
                return Result<string>.BadRequest("No such item in cart or invalid UserId/ProductId");

            _db.UserCarts.Remove(cartItem);
            _db.SaveChanges();
            return Result<string>.Ok("Product removed from cart successfully");
        }

        public Result<string> RemoveFromWhishList(int UserId, int ProductId)
        {
            var wishItem = _db.WishList.FirstOrDefault(w => w.UserId == UserId && w.ProductId == ProductId);
            if (wishItem == null)
                return Result<string>.BadRequest("No such item in wish list or invalid UserId/ProductId");

            _db.WishList.Remove(wishItem);
            _db.SaveChanges();
            return Result<string>.Ok("Product removed from wish list successfully");
        }

        public Result<List<Product>> SearchProducts(string KeyWord)
        {
            List<Product> products = _db.Products.Where(p => p.Name.Contains(KeyWord)).ToList();
            if (products == null)
                return Result<List<Product>>.BadRequest("No Products With This Name");
            return Result<List<Product>>.Ok(products);
        }

        public Result<List<CartItemResponseDto>> ShowUserCart(int UserId)
        {
            var cartItems = _db.UserCarts
                .Include(c => c.Product)
                .Where(c => c.UserId == UserId)
                .ToList();

            if (cartItems == null || cartItems.Count == 0)
                return Result<List<CartItemResponseDto>>.BadRequest("No User With This Id or Cart is empty");

            var result = cartItems.Select(c => new CartItemResponseDto
            {
                ProductId = c.ProductId,
                Quantity = c.Quantity,
                Product = new CartProductDto
                {
                    Name = c.Product.Name,
                    Price = c.Product.Price,
                    ImageUrl = c.Product.ImageUrl,
                    IsDiscounted = c.Product.isDiscounted ?? false,
                    DiscountPercentage = c.Product.DiscountPercentage
                }
            }).ToList();

            return Result<List<CartItemResponseDto>>.Ok(result);
        }

        public Result<List<GetProductDTO>> ShowUserWhishList(int UserId)
        {
            var wishListItems = _db.WishList.Where(w => w.UserId == UserId).ToList();

            if (wishListItems == null || wishListItems.Count == 0)
                return Result<List<GetProductDTO>>.BadRequest("No User With This Id or Wish List is empty");

            var productIds = wishListItems.Select(wi => wi.ProductId).ToList();
            var products = _db.Products.Where(p => productIds.Contains(p.Id))
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

            return Result<List<GetProductDTO>>.Ok(products);
        }

        public Result<string> UpdateUserCart(int UserId, UpdateCartDTO req)
        {
            var cartItem = _db.UserCarts.FirstOrDefault(c => c.UserId == UserId && c.ProductId == req.ProductId);
            if (cartItem == null)
                return Result<string>.BadRequest("No such item in cart or invalid UserId/ProductId");

            var product = _db.Products.FirstOrDefault(p => p.Id == req.ProductId);
            if (product == null)
                return Result<string>.BadRequest("No Product With This Id");

            int stockDiff = req.Quantity - cartItem.Quantity;
            if (product.Stock < req.Quantity)
                return Result<string>.BadRequest("Not enough stock available");

            cartItem.Quantity = req.Quantity;
            _db.SaveChanges();
            return Result<string>.Ok("Cart updated successfully");
        }

        
    }
}