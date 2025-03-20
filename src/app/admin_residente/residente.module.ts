import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidenteRoutingModule } from './residente-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ResidenteComponent } from './page/layout-admin-residente/residente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResidenteComponent
  ],
  exports: [
    ResidenteComponent
  ],
  imports: [
    CommonModule,
    ResidenteRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ResidenteModule { }
