import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalsuspendidoComponent } from './pages/layout-admin-personal-suspendido/personalsuspendido.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalsuspendidoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalsuspendidoRoutingModule { }
