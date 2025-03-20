import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PersonalreporteRoutingModule } from './personalreporte-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PersonalreporteComponent } from './pages/layout-admin-personalreporte/personalreporte.component';

@NgModule({
  declarations: [
    PersonalreporteComponent
  ],
  exports:[
    PersonalreporteComponent,
  ],
  imports: [
    CommonModule,
    PersonalreporteRoutingModule,
    SharedModule,
    FormsModule,
  ]
})
export class PersonalreporteModule { }
