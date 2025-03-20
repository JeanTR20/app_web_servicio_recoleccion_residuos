import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionPersonalizadaService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly baseApiUrl: string = environment.baseUrl;

  enviarnotificacionespersonalizadas(titulo: string, descripcion: string){
    const apiUrl = `${this.baseApiUrl}/admin-notificacion/enviar-notificacion-personalizada`;
    const body = {titulo, descripcion}
    return this.http.post(apiUrl, body)
  }
}
