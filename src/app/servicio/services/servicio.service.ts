import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Horario } from '../interfaces/horario';
import { environment } from 'src/environments/environment';
import { SwPush } from '@angular/service-worker';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Notificacion } from '../interfaces/notificacion';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private readonly baseApiUrl = environment.baseUrl;

  private readonly VAPID_PUBLIC_KEY = "BO7jQXdzmUdb14FqOdEyDkbVFMtvAUyUf2wAH3ODMPpbO1K-1YKBgoUhEb9cMCp0cfNehfPOdLbhzFAnBN4EWf8"

  constructor(
    private http: HttpClient,
    private swPush:SwPush,
    private readonly authService: AuthService
  ) { }

  public user = computed(() => this.authService.currentUser());

  listarHorarioByRutaYDia(id_ruta?: number, dia?: string, recorrido?: string){

    let params = new HttpParams()

    if(id_ruta){
      params = params.set('id_ruta', id_ruta);
    }

    if(dia){
      params = params.set('dia', dia);
    }

    if(recorrido){
      params = params.set('recorrido', recorrido);
    }

    const apiUrl = `${this.baseApiUrl}/horario`;

    return this.http.get<Horario[]>(apiUrl, {params: params})
  }

  //verficar la subscripcion
  async isSubscribed(){
    if(!('serviceWorker' in navigator)){
      console.error('Service Worker no soportado')
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      // console.log('Error al verificar la susbsripcion', error)
      return false;
    }
  }

  checkAndRequestSubscription(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.swPush.isEnabled) {
        Swal.fire({
          title: 'Habilitar Notificaciones',
          text: 'Las notificaciones están deshabilitadas. Habilita las notificaciones desde la configuración de tu navegador para recibir alertas.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
        });
      } else if (Notification.permission === 'default') {
        // El usuario nunca ha decidido sobre las notificaciones
        Swal.fire({
          title: 'Activa las notificaciones',
          text: 'Activa la notificaciones de la pagina para recibir alertas o recordatorios de tu programacion de horarios.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
        });

        this.requestSubscription().then(resolve).catch(reject);
      } else if (Notification.permission === 'denied') {
        // Permiso previamente denegado
        Swal.fire({
          title: 'Las notificaciones están deshabilitadas',
          text: 'Si deseas recibir notificaciones de tu programacion de horario, debes activar las notificaciones de la pagina.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
        });
        reject(new Error("El permiso de notificaciones no está activado"));
      } else {
        // Permiso concedido
        this.swPush.subscription.subscribe(sub => {
          if (sub === null) {
            this.requestSubscription().then(resolve).catch(reject);
          } else {
            resolve(sub);
          }
        });
      }
    });
  }

  requestSubscription(){
    return this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    });
  }

  async programarNotificacion(data: any){
    try {
      const token = localStorage.getItem('token')

      if(!token){
        throw new Error('Necesitas iniciar sesión para realizar esta acción');
      }

      const respuesta = await fetch(`${this.baseApiUrl}/notificacion/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

    } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message)
      }
    }
  }

  obtenerDatosNotificacion(){
    const token = localStorage.getItem('token');

    if(!token){
      return throwError('Token no proporcionado')
    }

    const apiUrl = `${this.baseApiUrl}/notificacion/obtener-notificacion/${token}`
    return this.http.get<Notificacion[]>(apiUrl)
  }

  cancelarNotificacion(tipo_programacion: number){
    const id_usuario = this.user()?.usuario_id

    const apiUrl = `${this.baseApiUrl}/notificacion/cancelar-notificacion`
    return this.http.post(apiUrl, {id_usuario, tipo_programacion});
  }

}
