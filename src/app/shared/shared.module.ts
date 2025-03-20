import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';


@NgModule({
  declarations: [
    //LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    SidebarMenuComponent,
  ],

  exports: [
    //LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    SidebarMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class SharedModule { }


