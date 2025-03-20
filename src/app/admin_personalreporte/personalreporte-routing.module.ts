import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalreporteComponent } from './pages/layout-admin-personalreporte/personalreporte.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalreporteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalreporteRoutingModule { }
