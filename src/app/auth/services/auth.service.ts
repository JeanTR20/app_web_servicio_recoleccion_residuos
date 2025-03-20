import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, pipe, retry, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthStatus, CheckTokenResponse, LoginResponse } from '../interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificacionService } from 'src/app/notificacion/services/notificacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly baseApiUrl: string = environment.baseUrl;

  private telefono: string = ''
  private isSubscribed = false;

  private http = inject(HttpClient);

  private _currentUser = signal<User| null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor(
    private notificacionService: NotificacionService
    // public jwtHelper: JwtHelperService
  ) {
    this.checkAuthStatus().subscribe()
  }

  private setAuthentication(user:User, token:string): boolean {

    this._currentUser.set(user),
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login( dni_usuario: string, contrasena: string): Observable<boolean>{

    const apiUrl = `${this.baseApiUrl}/auth/login`;

    const body = {dni_usuario, contrasena};

    return this.http.post<LoginResponse>(apiUrl, body)
    .pipe(
      tap(({user, token}) => {
        this.notificacionService.subscribeToNotifications(user.usuario_id)
      }),
      map(({user, token}) => this.setAuthentication(user, token)),

      catchError(err => throwError(() => err.error.message))
    );
  }

  checkAuthStatus(): Observable<boolean>{

    const token = localStorage.getItem('token');

    const url = `${this.baseApiUrl}/auth/validar-token/${token}`

    if(!token) {
      this.logout();
      return of(false)
    }

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map(({user, token}) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated)
        return of(false)
      })

    )
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated)
  }

  //register
  register(dni:string, nombre_usuario: string, telefono: string, contrasena: string, ){

    const apiUrl = `${this.baseApiUrl}/auth/register`;
    const body = {dni, nombre_usuario, contrasena, telefono};
    return this.http.post(apiUrl, body)
  }

  //envio de celular para restablecimiento
  enviarCelular(telefono : string){
    const url = `${this.baseApiUrl}/auth/enviar-sms`;
    const body = {telefono}
    return this.http.post(url, body)
  }

  setCelular(celular: string){
    this.telefono = celular
  }

  getCelular(): string {
    return this.telefono
  }

  verificacionCode(telefono: string, codigo_verificacion: string){
    const url = `${this.baseApiUrl}/auth/verificar-codigo`;
    const body = {telefono, codigo_verificacion};
    return this.http.post(url, body);
  }

  //reset password
  resetPassword(telefono: string, nuevo_password: string) {
    const url = `${this.baseApiUrl}/auth/actualizar-password`;
    const body = { telefono, nuevo_password }
    return this.http.post(url, body );
  }
}
