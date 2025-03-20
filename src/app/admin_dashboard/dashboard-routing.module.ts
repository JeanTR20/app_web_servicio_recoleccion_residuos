import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard.component';


const routes: Routes = [

  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'horario',
        loadChildren: () => import('../admin_horario/horario.module').then((m) => m.HorarioModule),
      },
      {
        path: 'reporte-residente',
        loadChildren: () => import('../admin_residentereporte/residentereporte.module').then((m) => m.ResidenteReporteModule)
      },
      {
        path: 'administracion-personal',
        loadChildren: () => import('../admin_adminpersonal/administracionpersonal.module').then((m) => m.AdministracionpersonalModule)
      },
      {
        path: 'reporte-personal',
        loadChildren: () => import('../admin_personalreporte/personalreporte.module').then((m) => m.PersonalreporteModule)
      },
      {
        path: 'personal-suspension',
        loadChildren: () => import('../admin_personalsuspendido/personalsuspendido.module').then((m) => m.PersonalsuspendidoModule)
      },
      {
        path: 'residente',
        loadChildren: () => import('../admin_residente/residente.module').then((m) => m.ResidenteModule)
      },
      {
        path: 'notificacion-personalizada',
        loadChildren: () => import('../admin_notificacion/notificacionpersonalizada.module').then((m) => m.NotificacionPersonalizadaModule)
      },
      {
        path: '**',
        redirectTo: 'horario'
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
