import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { AuthStatus } from '../../interfaces';
import { __values } from 'tslib';
import { error } from 'toastr';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)
  private validatorsService = inject(ValidatorsService)

  mostrarcontrasena: boolean = false;
  // mostrarUltimaletra = '';
  // utlimaLetraTimeout: any;

  public myform: FormGroup = this.fb.group({
    dni_usuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    contrasena:['', [Validators.required, Validators.minLength(6)]]
  })


  login(){

    if(this.myform.invalid){
      this.myform.markAllAsTouched();
      return;
    }

    const {dni_usuario, contrasena} = this.myform.value;

    this.authService.login(dni_usuario, contrasena)
    .subscribe({
      next: () => {
        // console.log('rol:', this.authService.currentUser()?.rol_nombre)
        const user = this.authService.currentUser();

        if(user){
          switch(user?.rol_nombre){
            case 'Administrador':
              this.router.navigateByUrl('/administracion/horario')
              break;
            case 'Recolector':
              this.router.navigateByUrl('/inicio')
              break;
            case 'Residente':
              this.router.navigateByUrl('/inicio')
              break;
            default:
              this.router.navigateByUrl('/autenticacion/iniciar_sesion')
              break;
          }
        }
      },
      error: (message) => {
        Swal.fire('Error', message  || 'Error en el servidor. Por favor, intente de nuevo mas tarde.', 'error' )
      }
    })
  }

  toggleMostrarContrasena(){
    this.mostrarcontrasena = !this.mostrarcontrasena;
  }

  // validatorInputNumber(event: KeyboardEvent){
  //   const pattern = /[0-9]/;

  //   if(!pattern.test(event.key)){
  //     event.preventDefault();
  //   }
  // }

  validatorInputNumber(event: KeyboardEvent){
    this.validatorsService.validatorInputNumber(event)
  }


  isValidField(field: string){
   return this.validatorsService.isValidField(this.myform, field)
  }

  getFieldError(field: string){
    return this.validatorsService.getFieldError(this.myform, field);
  }


  getFieldErrorCaracteres(field: string){
    return this.validatorsService.getFieldErrorCaracteres(this.myform, field);
  }

  // isValidField(field: string):boolean | null {
  //   return this.myform.controls[field].errors &&
  //   this.myform.controls[field].touched
  // }


  // getFieldErrorCaracteres(field: string): string | null{
  //   if(!this.myform.controls[field]) return null;

  //   const errors = this.myform.controls[field].errors || {}

  //   for(const key of Object.keys(errors)){
  //     switch(key){
  //       case 'required':
  //         return 'El campo es requerido.'
  //       case 'minlength':
  //         return `Minimo ${errors['minlength'].requiredLength } caracteres.`
  //     }
  //   }

  //   return null;
  // }


  // getFieldError(field: string): string | null{
  //   if(!this.myform.controls[field]) return null;

  //   const errors = this.myform.controls[field].errors || {}

  //   for(const key of Object.keys(errors)){
  //     switch(key){
  //       case 'required':
  //         return 'El campo es requerido.'
  //       case 'minlength':
  //         return `Minimo ${errors['minlength'].requiredLength } números.`
  //     }
  //   }

  //   return null;
  // }

}
