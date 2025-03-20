import { HttpClient } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private readonly VAPID_PUBLIC_KEY = "BO7jQXdzmUdb14FqOdEyDkbVFMtvAUyUf2wAH3ODMPpbO1K-1YKBgoUhEb9cMCp0cfNehfPOdLbhzFAnBN4EWf8"

  constructor(
    private swPush:SwPush,
    private http:HttpClient,
  ) { }

  subscribeToNotifications(id_usuario: number){
    if(!this.swPush.isEnabled){
      Swal.fire({
        title: 'Habilitar Notificaciones',
        text: 'Las notificaciones están deshabilitadas. Habilita las notificaciones desde la configuración de tu navegador para recibir alertas.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    }

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(subscripcion => {
      const enhancedSubscription ={
        id_usuario,
        subscripcion
      };
      this.sendSubscriptionToServer(enhancedSubscription);
    }).catch()

    if(Notification.permission === 'default'){
      Swal.fire({
        title: 'Las notificaciones están deshabilitadas',
        text: 'Habilita el permiso para recibir las notificaciones de alertas sobre reportes de incidencia de residuos solidos entre otros.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    }

    if(Notification.permission === 'denied'){
      Swal.fire({
        title: 'Las notificaciones están deshabilitadas',
        text: 'Si deseas recibir notificaciones importantes sobre reportes de incidencias de residuos solidos entre otros, debes activar las notificaciones de la pagina.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    }

  }

  private sendSubscriptionToServer(subscripcion: any){
    this.http.post(`${environment.baseUrl}/notificacion/subscribe`, subscripcion)
    .subscribe()
  }
}
