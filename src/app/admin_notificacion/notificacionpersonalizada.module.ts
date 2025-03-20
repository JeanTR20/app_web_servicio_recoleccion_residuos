import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionPersonalizadaRoutingModule } from './notificacionpersonalizada-routing.module';
import { NotificacionPersonalizadaComponent } from './pages/notificacionpersonalizada.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [
    NotificacionPersonalizadaComponent
  ],
  exports: [
    NotificacionPersonalizadaComponent
  ],
  imports: [
    CommonModule,
    NotificacionPersonalizadaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule
  ]
})
export class NotificacionPersonalizadaModule { }
