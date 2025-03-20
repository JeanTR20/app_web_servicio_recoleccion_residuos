import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificacionPersonalizadaComponent } from './pages/notificacionpersonalizada.component';


const routes: Routes = [
  {
    path: '',
    component: NotificacionPersonalizadaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificacionPersonalizadaRoutingModule { }
