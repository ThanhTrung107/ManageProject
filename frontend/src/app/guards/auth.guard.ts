import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard cho các route yêu cầu đăng nhập (USER hoặc ADMIN)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Guard cho các route chỉ ADMIN được truy cập
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  if (authService.isLoggedIn()) {
    // Đã đăng nhập nhưng không phải admin
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};