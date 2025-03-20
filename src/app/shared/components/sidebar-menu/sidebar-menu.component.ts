import { Component, computed, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router} from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';


interface menuItems {
  title: string,
  subtitle: string,
  open: boolean,
  router: string  | null,
  subItems: SubMenuItems[]
}

interface SubMenuItems {
  title: string,
  router: string,
}

@Component({
  selector: 'shared-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ){}

  public user = computed(() => this.authService.currentUser());
  public authStatus = computed(() => this.authService.authStatus());

  public menuItems = signal<menuItems[]>([
    {
      title: 'Horario',
      subtitle: 'Listado de horarios ',
      open: false,
      router: '/administracion/horario',
      subItems: []
    },
    {
      title: 'Personal',
      subtitle: 'Personal de recolección',
      open: false,
      router: null,
      subItems: [
        {
          title: 'Reportes de incidencia',
          router: '/administracion/reporte-personal',
        },
        {
          title: 'Listado de personal',
          router: '/administracion/administracion-personal',
        },
        {
          title: 'Personal en suspensión',
          router: '/administracion/personal-suspension',
        }
      ]
    },
    {
      title: 'Residente',
      subtitle: 'Residentes',
      open: false,
      router: null,
      subItems: [
        {
          title: 'Reportes de incidencia',
          router: '/administracion/reporte-residente',
        },
        {
          title: 'Listado de residentes',
          router: '/administracion/residente',
        },
      ]
    },
    {
      title: 'Notificación personalizado',
      subtitle: 'Notificación personalizado',
      open: false,
      router: '/administracion/notificacion-personalizada',
      subItems: []
    },
  ]);

  onLogout(){
    this.authService.logout();
  }

  inicialUser= this.user()?.usuario_nombre ? this.user()?.usuario_nombre[0].toUpperCase(): '';

  toggleDropdown(item: menuItems){
    // item.open = !item.open;
    // this.menuItems.mutate(items => {
    //   const targetItem = items.find(i => i.title === item.title);
    //   if (targetItem) {
    //     targetItem.open = !targetItem.open;
    //   }
    // });

    const updateItems = this.menuItems().map(i => {
       // Clonamos el estado actual de menuItems
      if(i.title === item.title){
        // Cambiamos el estado del item que corresponde
        return {...i, open: !i.open};
      }
      return i
    })

    this.menuItems.set(updateItems);
  }

  //Verifica si un subitem está activo en función de la URL actual.
  isSubItemActive(item: menuItems): boolean {
    const currentUrl = this.router.url;
    return item.subItems.some(subItem => currentUrl.includes(subItem.router));
  }

}
