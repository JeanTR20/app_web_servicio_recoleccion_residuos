import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RecoverComponent } from './pages/recover/recover.component';
import { VerificationCodeComponent } from './components/verification-code/verification-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'iniciar_sesion',
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: '**', redirectTo: 'iniciar_sesion'
      }
    ]
  },
  {
    path: 'recuperar_contrasena',
    children: [
      {
        path: '',
        component: RecoverComponent,
      },
      {
        path: 'verificar-codigo',
        component: VerificationCodeComponent,
      },
      {
        path: 'restablecer-contraseña',
        component: ResetPasswordComponent
      },
      {
        path: '**', redirectTo: 'recuperar_contrasena'
      }
    ]
  },
  {
    path: 'registrar',
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
