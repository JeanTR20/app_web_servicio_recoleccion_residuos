import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Reporte } from '../interfaces/reporte.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ReporteResponse } from '../interfaces/reporte-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ResidenteReporteService {

  private readonly baseApiUrl: string = environment.baseUrl;
  // public _currenIncidencia = signal<Reporte[] | null>(null);

  constructor(
    private http: HttpClient
  ) { }

  listarReporteIncidenciaResidente(direccion?: string, fecha_reporte?: string, estado?: string, page?:number, sizePage?: number){

    let params = new HttpParams().set('id_rol', '3');

    if(direccion){
      params = params.set('direccion', direccion);
    }

    if(fecha_reporte){
      params = params.set( 'fecha_reporte', fecha_reporte)
    }

    if(estado){
      params = params.set('estado', estado)
    }

    const apiUrl = `${this.baseApiUrl}/reporte-incidencia?&page=${page}&sizePage=${sizePage}`;
    return this.http.get<ReporteResponse>(apiUrl, {params: params})
  }

  actualizarCambiosEstado(id_incidencia: number, estado: boolean){
    const apiUrl = `${this.baseApiUrl}/reporte-incidencia/actualizar-estado/${id_incidencia}`;
    const body = {estado};
    return this.http.patch(apiUrl, body);
  }

  eliminarReporte(id_reporte: number){
    const apiUrl = `${this.baseApiUrl}/reporte-incidencia/eliminar-reporte/${id_reporte}`;
    return this.http.delete(apiUrl);
  }

}
