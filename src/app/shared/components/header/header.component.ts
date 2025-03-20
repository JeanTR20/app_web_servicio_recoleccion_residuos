import { ChangeDetectorRef, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';



interface menuItem {
  title: string;
  router: string | null;
  open: boolean;
  subItems: subMenuItem[];
}

interface subMenuItem {
  title: string;
  router: string;
}

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  showDropdownMenu: boolean = false;
  showDropdownServicio: boolean = false;

  changeIcon:Boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router)

  constructor(){}

  public user = computed(() => this.authService.currentUser());
  public authStatus = computed(() => this.authService.authStatus());

  public menuItems = signal<menuItem[]>([

    {
      title: 'Inicio',
      open: false,
      router: '/inicio',
      subItems: []
    },
    {
      title: 'Servicios',
      open: false,
      router: null,
      subItems: [
        {
          title: 'Recojo de residuos sólidos',
          router: '/servicios/recojo_residuos/horario_recoleccion'
        }
      ]
    },
    {
      title: 'Reporte de incidencia',
      open: false,
      router: '/incidencia',
      subItems: []
    }
  ]);

  onLogout(){
    this.authService.logout();
  }

  initialUser = this.user()?.usuario_nombre ? this.user()?.usuario_nombre[0].toUpperCase(): '';


  //verifica si el subItem esta activo
  isSubItemActive(route: string): boolean {
    return this.router.url.includes(route)
  }

  //Verifica si un subitem está activo en función de la URL actual.
  isSubItemActiveDinamico(item: menuItem): boolean {
    const currentUrl = this.router.url;
    return item.subItems.some(subItem => currentUrl.includes(subItem.router));
  }

  toggleServicio(item: menuItem){

    const uptdateItems = this.menuItems().map(i => {
      //Clonamos el estado actual de menuItems
      if(i.title === item.title){
        // Cambiamos el estado del item que corresponde
        return {...i, open: !i.open}
      }
      return i;
    })

    this.menuItems.set(uptdateItems)
  }

  openDropdownMenu(){
    this.showDropdownMenu = true;
  }

  closeDropdownMenu(){
    this.showDropdownMenu = false;
  }

}

