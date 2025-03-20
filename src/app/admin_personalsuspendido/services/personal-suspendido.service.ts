import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Personal } from 'src/app/admin_adminpersonal/interfaces/personal.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalSuspendidoService {

  private baseApiUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  listarPersonalSuspendido(numero_carnet?: string, apellidos_nombres?: string){

    let params = new HttpParams();

    if(numero_carnet){
      params = params.set('numero_carnet', numero_carnet);
    }

    if(apellidos_nombres){
      params = params.set('apellidos_nombres', apellidos_nombres);
    }
    const apiUrl = `${this.baseApiUrl}/admin-personal?estado=0`;
    return this.http.get<Personal[]>(apiUrl, {params: params})
  }

  activarCuenta(id_usuario: number){
    const apiUrl = `${this.baseApiUrl}/usuario/activar-cuenta/${id_usuario}`;
    return this.http.patch(apiUrl, {})
  }
}
