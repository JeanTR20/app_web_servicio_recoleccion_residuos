import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutHorarioComponent } from './pages/limpieza/layout-horario/layout-horario.component';

const routes: Routes = [
  {
    path: 'recojo_residuos',
    children: [
      {
        path: 'horario_recoleccion',
        component: LayoutHorarioComponent
      },
      {
        path: '**',
        redirectTo: 'horario_recoleccion'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicioRoutingModule { }
