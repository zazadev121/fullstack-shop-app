import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Result } from '../models/result.model';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Order, OrderStatus } from '../models/order.model';
import { User, UserRoles } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/Admin`;

  constructor(private http: HttpClient) {}

  // Categories
  getAllCategories(): Observable<Result<any[]>> {
    return this.http.get<Result<any[]>>(`${this.apiUrl}/categories`);
  }
  createCategory(data: any): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/CreateCategory`, data);
  }
  updateCategory(categoryId: number, data: any): Observable<Result<string>> {
    return this.http.put<Result<string>>(`${this.apiUrl}/UpdateCategory/${categoryId}`, data);
  }
  deleteCategory(categoryId: number): Observable<Result<string>> {
    return this.http.delete<Result<string>>(`${this.apiUrl}/DeleteCategory/${categoryId}`);
  }

  // Users
  getAllUsers(): Observable<Result<User[]>> {
    return this.http.get<Result<User[]>>(`${this.apiUrl}/Allusers`);
  }
  getUserById(userId: number): Observable<Result<User>> {
    return this.http.get<Result<User>>(`${this.apiUrl}/UserById/${userId}`);
  }
  changeUserRole(userId: number, newRole: UserRoles): Observable<Result<string>> {
    return this.http.put<Result<string>>(`${this.apiUrl}/ChangeUserRole/${userId}?newRole=${newRole}`, {});
  }
  deleteUser(userId: number): Observable<Result<string>> {
    return this.http.delete<Result<string>>(`${this.apiUrl}/DeleteUser/${userId}`);
  }

  // Orders
  getAllOrders(): Observable<Result<Order[]>> {
    return this.http.get<Result<Order[]>>(`${this.apiUrl}/AllOrders`);
  }
  getOrderById(orderId: number): Observable<Result<Order>> {
    return this.http.get<Result<Order>>(`${this.apiUrl}/OrderById/${orderId}`);
  }
  updateOrderStatus(orderId: number, newStatus: OrderStatus): Observable<Result<string>> {
    return this.http.put<Result<string>>(`${this.apiUrl}/UpdateOrderStatus/${orderId}?newStatus=${newStatus}`, {});
  }

  // Products
  createProduct(data: any): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/CreateProduct`, data);
  }
  updateProduct(productId: number, data: any): Observable<Result<string>> {
    return this.http.put<Result<string>>(`${this.apiUrl}/UpdateProduct/${productId}`, data);
  }
  deleteProduct(productId: number): Observable<Result<string>> {
    return this.http.delete<Result<string>>(`${this.apiUrl}/DeleteProduct/${productId}`);
  }

  // Dashboard & Discounts
  getAllDiscountedProducts(): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/DiscountedProducts`);
  }
  getTotalRevenue(): Observable<Result<number>> {
    return this.http.get<Result<number>>(`${this.apiUrl}/GetToTalRevenue`);
  }
  getMostSoldProducts(avgStockNum: number): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/MostSoldProducts/${avgStockNum}`);
  }
  getLowStockProducts(threshold: number): Observable<Result<Product[]>> {
    return this.http.get<Result<Product[]>>(`${this.apiUrl}/LowStockProduct/${threshold}`);
  }
  addDiscount(productId: number, percentage: number): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.apiUrl}/AddDiscount/${productId}?discountPercentage=${percentage}`, {});
  }
  removeDiscount(productId: number): Observable<Result<string>> {
    return this.http.delete<Result<string>>(`${this.apiUrl}/RemoveDiscount/${productId}`);
  }
}
