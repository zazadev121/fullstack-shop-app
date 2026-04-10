import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent), pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/public/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/public/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/public/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/public/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'logout', loadComponent: () => import('./features/public/logout/logout.component').then(m => m.LogoutComponent) },
  { path: 'verify-email', loadComponent: () => import('./features/public/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  { path: 'products', loadComponent: () => import('./features/shop/product-listing/product-listing.component').then(m => m.ProductListingComponent) },
  { path: 'product/:id', loadComponent: () => import('./features/shop/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  
  // Protected User Routes
  { path: 'cart', loadComponent: () => import('./features/shop/cart/cart.component').then(m => m.CartComponent), canActivate: [authGuard] },
  { path: 'wishlist', loadComponent: () => import('./features/shop/wishlist/wishlist.component').then(m => m.WishlistComponent), canActivate: [authGuard] },
  { path: 'orders', loadComponent: () => import('./features/shop/orders/orders.component').then(m => m.OrdersComponent), canActivate: [authGuard] },

  // Admin Routes
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/products/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'categories', loadComponent: () => import('./features/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'orders', loadComponent: () => import('./features/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent) }
    ]
  }
];
