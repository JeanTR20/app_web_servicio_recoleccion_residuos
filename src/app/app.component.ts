import { ChangeDetectorRef, Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'FrontEnd-PGR';

  private authService = inject(AuthService);
  private router = inject(Router);
  private routerSubscription: Subscription | undefined;

  constructor(
  ){

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {

      const navigationEnd = event as NavigationEnd
      if(this.authService.authStatus() === AuthStatus.notAuthenticated){
        localStorage.setItem('lastRoute', navigationEnd.urlAfterRedirects);
      }

      if(this.authService.currentUser()?.rol_nombre === 'Administrador'){
        localStorage.setItem('lastRouteAdmin', navigationEnd.urlAfterRedirects);
      }
    })
  }


  public finishedAuthCheck = computed<boolean>(() => {
    console.log(this.authService.authStatus())
    // if(this.authService.authStatus() === AuthStatus.checking){
    //   return false;
    // }
    // return true;

    return this.authService.authStatus() !== AuthStatus.checking;
  })

  public authStatusChangedEffect = effect(()=> {

    switch(this.authService.authStatus()){
      case AuthStatus.checking:
        return;
      case AuthStatus.authenticated:
        switch(this.authService.currentUser()?.rol_nombre){
          case 'Administrador':

            //removemos la redirección la ruta del administrador porque no es necesario para el no autenticado
            localStorage.removeItem('lastRoute')

            const redirectPath = localStorage.getItem('lastRouteAdmin')
            if(redirectPath){
              localStorage.removeItem('lastRouteAdmin');
              this.router.navigateByUrl(redirectPath)
            } else{
              this.router.navigateByUrl('/administracion/horario')
            }
            return;

          case 'Recolector':
            return;

          case 'Residente':
            return;

          default:
            this.router.navigateByUrl('/autenticacion/iniciar_sesion')
            return;
        }
      case AuthStatus.notAuthenticated:

        //removemos la redirección la ruta del administrador porque no es necesario para el no autenticado
        localStorage.removeItem('lastRouteAdmin')

        const redirectPath = localStorage.getItem('lastRoute')
        if(redirectPath){
          this.router.navigateByUrl(redirectPath)
        } else {
          this.router.navigateByUrl('/inicio')
        }
        return;
    }

  })

  ngOnDestroy(): void {
    if(this.routerSubscription){
      this.routerSubscription?.unsubscribe();
    }
  }

}
