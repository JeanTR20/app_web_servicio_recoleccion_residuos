import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ResidenteReporteComponent } from './pages/layout-admin-residentereporte/residentereporte.component';
import { ResidenteReporteRoutingModule } from './residentereporte-routing.module';


@NgModule({
  declarations: [
    ResidenteReporteComponent
  ],
  exports:[
    ResidenteReporteComponent,
  ],
  imports: [
    CommonModule,
    ResidenteReporteRoutingModule,
    SharedModule,
    FormsModule,
  ]
})
export class ResidenteReporteModule { }
