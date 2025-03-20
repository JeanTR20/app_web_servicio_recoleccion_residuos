import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioRoutingModule } from './servicio-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { TableListComponent } from './components/table-list/table-list.component';
import { LayoutHorarioComponent } from './pages/limpieza/layout-horario/layout-horario.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TableListComponent,
    LayoutHorarioComponent,
  ],

  exports: [
    TableListComponent,
  ],
  imports: [
    CommonModule,
    ServicioRoutingModule,
    SharedModule,
    GoogleMapsModule,
    ReactiveFormsModule
  ]
})
export class ServicioModule {
}
