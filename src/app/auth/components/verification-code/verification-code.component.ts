import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
    private fb:FormBuilder,
    private toastr: ToastrService
  ){}

  public verificacionform:FormGroup = this.fb.group({
    codigo_verificacion: ['', [Validators.required, Validators.minLength(6)]],
  });

  verificarcodigo(){
    if(this.verificacionform.valid){

      const {codigo_verificacion} = this.verificacionform.value;

      const telefono = this.authService.getCelular();

      console.log(this.authService.getCelular())

      if (!telefono || telefono.length !== 9 || !/^\d+$/.test(telefono)) {
        this.toastr.error('El número de teléfono debe ser de 9 dígitos', 'Error de Validación');
        return;
      }

      this.authService.verificacionCode(telefono, codigo_verificacion)
      .subscribe({
        next: () => {
          this.route.navigateByUrl('autenticacion/iniciar_sesion/recuperar_contrasena/restablecer-contraseña')
          this.verificacionform.reset();
          this.toastr.success('Código verificado exitosamente', 'Éxito')
        },
        error: (error) => {
          this.toastr.error('Error en la verificacion del código ' + error.error.message, 'Error')
        }
      })
    }
  }

  validarInputCodigo(event: KeyboardEvent){
    const pattern = /[0-9]/;

    if(!pattern.test(event.key)){
      event.preventDefault();
    }
  }
}
