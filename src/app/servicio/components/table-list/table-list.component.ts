import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Horario } from '../../interfaces/horario';
import { ServicioService } from '../../services/servicio.service';
import { __values } from 'tslib';
import { GoogleMapsModule } from '@angular/google-maps';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent{

  @Input() horario: Horario[] = [];

  constructor(){
  }
}
