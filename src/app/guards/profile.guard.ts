import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Allow access to the '' route for any user
    if (
      route.routeConfig?.path === '' ||
      this.authService.userRole === 'ADMIN'
    ) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
}

export const canActivateChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (
    route.routeConfig?.path === '' ||
    inject(AuthService).userRole === 'ADMIN'
  ) {
    return true;
  } else {
    inject(Router).navigate(['/login']);
    return false;
  }
};
