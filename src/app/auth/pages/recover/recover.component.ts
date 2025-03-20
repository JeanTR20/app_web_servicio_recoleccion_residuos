import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { error } from 'toastr';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent {

  constructor(
    private authService:AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private validatorsService: ValidatorsService
  ){}

  public myform: FormGroup = this.fb.group({
    celular: ['', [Validators.required, Validators.pattern('[0-9]+')]]
  });

  enviarcelular(){
    if(this.myform.valid){
      const {celular} = this.myform.value;

      this.authService.setCelular(celular)
      this.authService.enviarCelular(celular)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('autenticacion/iniciar_sesion/recuperar_contrasena/verificar-codigo');
          this.myform.reset();
          this.toastr.success('Se envió un código de verificación al número de celular para restablecer contraseña', 'Éxito');
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Error en el servidor. Por favor, intente de nuevo mas tarde.', 'Error');
        }
      })
    }
  }

  validarInputCelular(event: KeyboardEvent){
    this.validatorsService.validatorInputNumber(event)
  }
}
