import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioRoutingModule } from './inicio-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutPageInicioComponent } from './pages/layout-page/layout-page.component';

@NgModule({
  declarations: [
    LayoutPageInicioComponent

  ],
  exports:[
    LayoutPageInicioComponent
  ],

  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedModule,
  ]

})
export class InicioModule { }
