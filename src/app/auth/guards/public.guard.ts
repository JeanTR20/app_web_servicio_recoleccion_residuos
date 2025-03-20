import { CanActivateFn, Router, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const publicGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();

  // if( user && roles.includes(user.rol_nombre)){
  //   return true
  // }

  if(authService.authStatus() === AuthStatus.authenticated){
    router.navigateByUrl('/administracion/horario');
    return false;
  }

  return true;
};
