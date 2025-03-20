import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Residente } from '../interfaces/residente';
import { ResidenteResponse } from '../interfaces/residente-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ResidenteService {
  private baseApiUrl: string = environment.baseUrl;

  constructor (
    private http: HttpClient
  ){}

  listarResidente(numero_carnet?:string, nombres_usuario?:string, page?: number, sizePage?: number){

    let params = new HttpParams();

    if(numero_carnet){
      params = params.set('numero_carnet', numero_carnet)
    }

    if(nombres_usuario){
      params = params.set('nombres_usuario', nombres_usuario)
    }

    const apiUrl = `${this.baseApiUrl}/admin-residente?&page=${page}&sizePage=${sizePage}`
    return this.http.get<ResidenteResponse>(apiUrl, {params:params});
  }

  listarResidenteFiltrado(numero_carnet?:string, nombres_usuario?:string){

    let params = new HttpParams();

    if(numero_carnet){
      params = params.set('numero_carnet', numero_carnet)
    }

    if(nombres_usuario){
      params = params.set('nombres_usuario', nombres_usuario)
    }

    const apiUrl = `${this.baseApiUrl}/admin-residente/residente-filtrado`
    return this.http.get<Residente[]>(apiUrl, {params:params});
  }


  eliminaResidente(id_usuario:number){
    const apiUrl = `${this.baseApiUrl}/admin-residente/eliminar-residente/${id_usuario}`;
    return this.http.delete(apiUrl);
  }

  editarResidente(
    id_usuario: number,
    telefono: string,
    carnet_identidad: string,
    nombre_usuario: string,
  ){
    const apiUrl = `${this.baseApiUrl}/admin-residente/actualizar/${id_usuario}`;
    const body = {
      telefono,
      carnet_identidad,
      nombre_usuario,
    }
    return this.http.patch(apiUrl, body)
  }
}
