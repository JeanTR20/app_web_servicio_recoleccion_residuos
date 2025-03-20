import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PersonalsuspendidoRoutingModule } from './personalsuspendido-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PersonalsuspendidoComponent } from './pages/layout-admin-personal-suspendido/personalsuspendido.component';

@NgModule({
  declarations: [
    PersonalsuspendidoComponent
  ],
  exports:[
    PersonalsuspendidoComponent,
  ],
  imports: [
    CommonModule,
    PersonalsuspendidoRoutingModule,
    SharedModule,
    FormsModule,
  ]
})
export class PersonalsuspendidoModule { }
