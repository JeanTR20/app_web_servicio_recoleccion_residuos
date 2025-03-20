import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResidenteReporteComponent } from './pages/layout-admin-residentereporte/residentereporte.component';


const routes: Routes = [
  {
    path: '',
    component: ResidenteReporteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidenteReporteRoutingModule { }
