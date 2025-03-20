import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdministracionpersonalRoutingModule } from './administracionpersonal-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AdministracionpersonalComponent } from './pages/layout-admin-personal/administracionpersonal.component';

@NgModule({
  declarations: [
    AdministracionpersonalComponent
  ],
  exports:[
    AdministracionpersonalComponent,
  ],
  imports: [
    CommonModule,
    AdministracionpersonalRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdministracionpersonalModule { }
