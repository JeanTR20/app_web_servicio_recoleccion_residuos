import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidenciaComponent } from './pages/layout-incidencia/incidencia.component';
import { ListadoReporteComponent } from './components/listado-reporte/listado-reporte.component';


const routes: Routes = [
  {
    path: '',
    component: IncidenciaComponent
  },
  {
    path: 'listado-reporte',
    component: ListadoReporteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenciaRoutingModule { }
