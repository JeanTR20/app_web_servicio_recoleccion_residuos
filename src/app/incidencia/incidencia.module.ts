import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { IncidenciaComponent } from './pages/layout-incidencia/incidencia.component';
import { IncidenciaRoutingModule } from './incidencia-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ListadoReporteComponent } from './components/listado-reporte/listado-reporte.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    IncidenciaComponent,
    ListadoReporteComponent
  ],
  exports:[
    IncidenciaComponent,
    ListadoReporteComponent
  ],
  imports: [
    CommonModule,
    IncidenciaRoutingModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    SharedModule,
    RouterModule
  ]
})
export class IncidenciaModule { }
