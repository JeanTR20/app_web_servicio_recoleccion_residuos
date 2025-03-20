import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const privateGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);


  const user = authService.currentUser();

  if( authService.authStatus() === AuthStatus.authenticated){

    // Obtener los roles permitidos desde el 'data' de la ruta
    const roles = route.data['roles'] as Array<string>;

    // Si no se especifican roles en la ruta, permitir el acceso
    if (!roles || roles.length === 0) {
      return true;
    }

    if (user && roles.includes(user?.rol_nombre) ) {
      return true;
    } else {
      // Si no tiene el rol adecuado, redirigir a una página de inicio o de acceso denegado
      router.navigateByUrl('/inicio'); // Puedes cambiar la ruta a una página de error
      return false;
    }

  }

  router.navigateByUrl('/inicio')
  return false;
};
