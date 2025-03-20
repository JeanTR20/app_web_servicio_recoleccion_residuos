import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificacionPersonalizadaService } from '../services/notificacionpersonalizada.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pages',
  templateUrl: './notificacionpersonalizada.component.html',
  styleUrls: ['./notificacionpersonalizada.component.css']
})
export class NotificacionPersonalizadaComponent {

  showNotificacion: boolean = false;
  showEmoticonesDescripcion: boolean = false;
  showEmoticonesTitulo: boolean = false;
  isLoading:boolean = false;

  public mostrarPrimerIconoDescripcion: boolean = true;
  public mostrarPrimerIconoTitulo: boolean = true;

  constructor(
    private notificacionPersonalizadaService: NotificacionPersonalizadaService,
    private fb: FormBuilder,

  ){

  }

  public myformnotificacion: FormGroup = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(166)]],
    titulo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(33)]]
  })

  addEmojiTitulo(event: any) {
    const emoji = event.emoji.native;
    const controlTitulo = this.myformnotificacion.get('titulo');

    if(controlTitulo){
      const currentValue = controlTitulo.value;
      controlTitulo.setValue( currentValue + emoji)
    }
  }

  addEmojiDescripcion(event: any){
    const emoji = event.emoji.native;
    const controlDescripcion = this.myformnotificacion.get('descripcion');

    if(controlDescripcion){
      const currentValue = controlDescripcion.value;
      controlDescripcion.setValue( currentValue + emoji)
    }
  }

  enviarNotificacion(){

    if(!this.myformnotificacion.get('descripcion')?.valid){
      Swal.fire('Error', 'El campo descripcion no debe ser menor a 10 caracteres', 'error');
      this.closeEnviarNotificacion();
      return;
    }

    if(!this.myformnotificacion.get('titulo')?.valid){
      Swal.fire('Error', 'El campo titulo no debe ser menor a 6 caracteres', 'error');
      this.closeEnviarNotificacion();
      return;
    }

    const {titulo, descripcion} = this.myformnotificacion.value;

    this.isLoading = true;

    this.notificacionPersonalizadaService.enviarnotificacionespersonalizadas(titulo, descripcion)
    .subscribe({
      next: () => {
        this.closeEnviarNotificacion();
        this.myformnotificacion.get('descripcion')?.reset();
        Swal.fire('success', 'Se envió la notificación personalizada a todos los usuarios exitosamente', 'success');
      },
      error: () =>{
        Swal.fire('Error', 'No se pudo enviar la notificacion personalizada a los usuarios. Por favor, intente de nuevo', 'error');
      },
      complete: () =>{
        this.isLoading = false;
      }
    });
  }

  closeEnviarNotificacion(){
    this.showNotificacion = false;
  }
  openEnviarNotificacion(){
    this.showNotificacion = true;
  }

  toggleIconTitulo() {

    this.mostrarPrimerIconoTitulo = !this.mostrarPrimerIconoTitulo;

    if(this.mostrarPrimerIconoTitulo){
      this.showEmoticonesTitulo = false;
    }else{
      this.showEmoticonesTitulo = true;
    }
  }

  toggleIconDescripcion() {

    this.mostrarPrimerIconoDescripcion = !this.mostrarPrimerIconoDescripcion;

    if(this.mostrarPrimerIconoDescripcion){
      this.showEmoticonesDescripcion = false;
    }else{
      this.showEmoticonesDescripcion = true;
    }
  }
}
