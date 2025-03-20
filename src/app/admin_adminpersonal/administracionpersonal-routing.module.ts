import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionpersonalComponent } from './pages/layout-admin-personal/administracionpersonal.component';


const routes: Routes = [
  {
    path: '',
    component: AdministracionpersonalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionpersonalRoutingModule { }
