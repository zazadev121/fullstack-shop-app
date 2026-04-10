import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRoles } from '../models/user.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.currentUser();

  if (user && user.role === UserRoles.Admin) {
    return true;
  }

  // Not logged in or not admin
  router.navigate(['/']); // Redirect to home
  return false;
};
