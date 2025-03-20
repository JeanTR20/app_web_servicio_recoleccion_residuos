// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { privateGuard } from './auth/guards/private.guard';
import { publicGuard } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then((m) => m.InicioModule),
  },
  {
    path: 'servicios',
    loadChildren: () => import('./servicio/servicio.module').then((m) => m.ServicioModule),
  },
  {
    path: 'incidencia',
    loadChildren: () => import('./incidencia/incidencia.module').then((m) => m.IncidenciaModule)
  },
  {
    path: 'autenticacion',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'administracion',
    canActivate: [privateGuard],
    loadChildren: () => import('./admin_dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { roles: ['Administrador']}
  },

  // Redirección desde la raíz
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },

  //Comodín para rutas no encontradas
  {
    path: '**',
    redirectTo: 'inicio'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
