import { PersonalSuspendidoService } from './../../services/personal-suspendido.service';
import { Component, OnInit } from '@angular/core';
import { Personal } from 'src/app/admin_adminpersonal/interfaces/personal.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personalsuspendido',
  templateUrl: './personalsuspendido.component.html',
  styleUrls: ['./personalsuspendido.component.css']
})
export class PersonalsuspendidoComponent implements OnInit{

  personal: Personal[] = [];

  textBusqueda: string = '';
  showActivarCuenta = false;

  public idUsuario: number | null = null

  constructor(
    private personalSuspendidoService: PersonalSuspendidoService,
  ){}
  ngOnInit(): void {
    this.listarpersonalsuspendido()
  }

  listarpersonalsuspendido(){
    this.personalSuspendidoService.listarPersonalSuspendido()
    .subscribe(personals => {
      this.personal = personals;
    })
  }

  borrarTexto(){
    this.textBusqueda = '';
    this.buscarpersonal();
  }

  closeActivarCuenta(){
    this.showActivarCuenta = false;

  }

  openActivarCuenta(id_usuario: number){
    this.showActivarCuenta = true;
    this.idUsuario = id_usuario
  }

  activarcuenta(id_usuario: number){
    this.personalSuspendidoService.activarCuenta(id_usuario)
    .subscribe({
      next: () => {
        this.closeActivarCuenta();
        this.listarpersonalsuspendido();
      },
      error: (error) => {
        // console.error('Error durante el registro:', error);
        Swal.fire('Error', 'No se pudo activar la cuenta. Por favor, intente de nuevo', 'error');
      }
    })
  }

  buscarpersonal(){
    const isNumeroCarnet = /^\d{8,12}$/.test(this.textBusqueda);

    if(isNumeroCarnet){
      const numero_carnet = this.textBusqueda;

      this.personalSuspendidoService.listarPersonalSuspendido(numero_carnet, undefined)
      .subscribe(personals => {
        this.personal = personals;

      });
    }else if(this.textBusqueda){
      const apellidos_nombres = this.textBusqueda;
      this.personalSuspendidoService.listarPersonalSuspendido(undefined, apellidos_nombres)
      .subscribe(personals => {
        this.personal = personals;
      });
    } else {
      this.personalSuspendidoService.listarPersonalSuspendido(undefined, undefined)
      .subscribe(personals => {
        this.personal = personals;
      });
    }
  }
}
