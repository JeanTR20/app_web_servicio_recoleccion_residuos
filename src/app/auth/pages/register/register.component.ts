import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, MaxLengthValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { error } from 'toastr';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(){
  }

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService)

  public mostrarcontrasena: Boolean = false;

  public myform: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    nombre_usuario: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
  });

  toggleMostrarContrasena(){
    this.mostrarcontrasena = !this.mostrarcontrasena;
  }

  registrarUser(){

    if(this.myform.invalid){
      this.myform.markAllAsTouched();
      return;
    }

    if(this.myform.valid){
      let {dni, nombre_usuario, telefono, contrasena} = this.myform.value;

      this.authService.register(dni, nombre_usuario, telefono, contrasena).
      subscribe({
        next:()=> {
          this.myform.reset();
          this.router.navigateByUrl('/autenticacion/iniciar_sesion');
          Swal.fire('¡Registro exitoso!', 'Ya puede iniciar sesión', 'success');
        },
        error: (error) => {
          Swal.fire('Error', error.error.message  || 'Error en el servidor. Por favor, intente de nuevo mas tarde.', 'error');
        }
      });
    } else{
      Swal.fire('Error', 'No es valido el formulario.', 'error');
    }
  }

  ValidarInputNumber(event: KeyboardEvent){
    this.validatorsService.validatorInputNumber(event)
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.myform, field)
  }

  getFieldError(field: string){
    return this.validatorsService.getFieldError(this.myform, field)
  }

  getFieldErrorCaracteres(field: string){
    return this.validatorsService.getFieldErrorCaracteres(this.myform, field)
  }
}
