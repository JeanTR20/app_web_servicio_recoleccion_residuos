import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResidenteComponent } from './page/layout-admin-residente/residente.component';

const routes: Routes = [
  {
    path: '',
    component: ResidenteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidenteRoutingModule { }
