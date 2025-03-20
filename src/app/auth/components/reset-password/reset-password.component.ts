import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { success } from 'toastr';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  mostrarcontrasena: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
    private fb:FormBuilder,
    private toastr: ToastrService
  ){}

  public myform:FormGroup = this.fb.group({
    nuevo_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
  })

  // private validarCoincidenciaPass(form: FormGroup){
  //   const nuevo_password = form.get('nuevo_password')?.value;
  //   const confirmar_contrasena = form.get('confirmar_contrasena')?.value;
  //   return nuevo_password === confirmar_contrasena ? null : {discordancia: true}
  // }

  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe(params =>{
    //   this.token = params['token']
    // })
  }

  recoverpassword(){
    if(this.myform.valid){

      const telefono = this.authService.getCelular()

      const {nuevo_password} = this.myform.value;


      this.authService.resetPassword(telefono, nuevo_password)
      .subscribe({
        next: () => {
          this.route.navigateByUrl('autenticacion/iniciar_sesion')
          this.toastr.success('Se registro exitosamente su nueva contraseña', 'Éxito')
        },
        error: (error) => {
          console.error('Error durante el restablecimiento de contraseña:', error.error);
          this.toastr.error('Error durante el restablecimiento de contraseña', 'Error')
        }
      })
    }
  }

  toggleMostrarContrasena(){
    this.mostrarcontrasena = !this.mostrarcontrasena;
  }
}
