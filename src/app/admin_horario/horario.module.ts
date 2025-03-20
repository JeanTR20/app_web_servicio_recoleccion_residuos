import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HorarioRoutingModule } from './horario-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HorarioComponent } from './pages/layout-admin-horario/horario.component';

@NgModule({
  declarations: [
    HorarioComponent
  ],
  exports:[
    HorarioComponent,
  ],
  imports: [
    CommonModule,
    HorarioRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HorarioModule { }
