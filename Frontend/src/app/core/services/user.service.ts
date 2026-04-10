import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Result } from '../models/result.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  // Unauthenticated Methods
  getAllProducts(): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/GetAllProducts`);
  }

  searchProducts(keyword: string): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/SearchProducts/${keyword}`);
  }

  getProductById(id: number): Observable<Result<Product>> {
    return this.http.get<Result<Product>>(`${this.apiUrl}/GetSingularProductById/${id}`);
  }

  filterByStock(): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/FilterByStock`);
  }

  filterByDiscount(): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/FilterByDiscount`);
  }

  filterByCategory(categoryId: number): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/FilterByCategory/${categoryId}`);
  }

  filterByPrice(minPrice: number): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/FilterByPrice/${minPrice}`);
  }

  // Authenticated Methods (JWT attached by interceptor)
  // Cart
  showUserCart(): Observable<Result<CartItem[]>> {
    return this.http.get<Result<CartItem[]>>(`${this.apiUrl}/ShowUserCart`);
  }

  addToCart(productId: number): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/AddToCart/${productId}`, {});
  }

  removeFromCart(productId: number): Observable<Result<string>> {
    return this.http.delete<Result<string>>(`${this.apiUrl}/RemoveFromCart/${productId}`);
  }

  updateCart(productId: number, quantity: number): Observable<Result<string>> {
    // Backend takes UpdateCartDTO. We need to create it.
    return this.http.put<Result<string>>(`${this.apiUrl}/UpdateCart`, { ProductId: productId, Quantity: quantity });
  }

  // Wishlist
  getUserWishlist(): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/GetUserWishlist`);
  }

  addToWishlist(productId: number): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/AddToWishlist/${productId}`, {});
  }

  removeFromWishlist(productId: number): Observable<Result<string>> {
    return this.http.delete<Result<string>>(`${this.apiUrl}/RemoveFromwishList/${productId}`);
  }

  // Orders
  showUserOrders(): Observable<Result<Order[]>> {
    return this.http.get<Result<Order[]>>(`${this.apiUrl}/ShowUserOrders`);
  }

  createOrder(): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/CreateOrder`, {});
  }

  deleteOrder(orderId: number): Observable<Result<string>> {
    return this.http.delete<Result<string>>(`${this.apiUrl}/DeleteOrder/${orderId}`);
  }
}
