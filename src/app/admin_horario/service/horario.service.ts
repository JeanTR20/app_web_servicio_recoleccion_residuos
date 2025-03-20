import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Horario } from 'src/app/servicio/interfaces/horario';
import { environment } from 'src/environments/environment';
import { Ruta } from '../interfaces/ruta.interface';
import { BehaviorSubject, Observable, catchError, take, tap } from 'rxjs';
import { error } from 'toastr';
import { HorarioResponse } from '../interfaces/horario-response.interface';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private http: HttpClient) { }

  private readonly baseApiUrl = environment.baseUrl;

  private rutaSubject = new BehaviorSubject<Ruta[]>([]);
  public rutasS = this.rutaSubject.asObservable()

  anadirRuta(ruta_nombre: string, ruta_descripcion?: string){
    const apiUrl = `${this.baseApiUrl}/horario/anadir-ruta`;
    const body = {ruta_nombre, ruta_descripcion};

    return this.http.post(apiUrl, body)
  }

  deleteRuta(id_ruta: number){
    const apiUrl = `${this.baseApiUrl}/horario/eliminar-ruta/${id_ruta}`;
    return this.http.delete(apiUrl);
  }

  listarRuta(): Observable<Ruta[]>{
    const apiUrl = `${this.baseApiUrl}/horario/listar-ruta`;
    return this.http.get<Ruta[]>(apiUrl)
    .pipe(
      tap(rutas => {
        this.rutaSubject.next(rutas)
      }),
    );
  }

  listarhorario(id_ruta?: number, dia?:string, recorrido?:string, page?: number, sizePage?: number){
    let params = new HttpParams();

    if(id_ruta){
      params = params.set('id_ruta', id_ruta);
    }

    if(dia){
      params = params.set('dia', dia);
    }

    if(recorrido && recorrido.trim() !== ''){
      params = params.set('recorrido', recorrido.trim())
    }

    const apiUrl = `${this.baseApiUrl}/admin-horario?&page=${page}&sizePage=${sizePage}`;
    return this.http.get<HorarioResponse>(apiUrl, {params: params});
  }

  listarhorariofiltrado(id_ruta?: number, dia?:string, recorrido?:string){
    let params = new HttpParams();

    if(id_ruta){
      params = params.set('id_ruta', id_ruta);
    }

    if(dia){
      params = params.set('dia', dia);
    }

    if(recorrido && recorrido.trim() !== ''){
      params = params.set('recorrido', recorrido.trim())
    }

    const apiUrl = `${this.baseApiUrl}/admin-horario/horario-filtro`;
    return this.http.get<Horario[]>(apiUrl, {params: params});
  }

  crearHorario(dia: string, hora_inicio: Date, recorrido: string, referencia_punto: string, ruta_id:number){
    const apiUrl = `${this.baseApiUrl}/admin-horario/crear-horario`;
    const body = {dia, hora_inicio, recorrido, referencia_punto, ruta_id}
    return this.http.post(apiUrl, body);
  }

  editarHorario(id_horario:number, dia: string, hora_inicio: Date, recorrido: string, referencia_punto: string, ruta_id:number){
    const apiUrl = `${this.baseApiUrl}/admin-horario/actualizar-horario/${id_horario}`;
    const body = {dia, hora_inicio, recorrido, referencia_punto, ruta_id}
    return this.http.patch(apiUrl, body);
  }

  deleteHorario(id_horario: number){
    const apiUrl = `${this.baseApiUrl}/admin-horario/eliminar-horario/${id_horario}`;
    return this.http.delete(apiUrl);
  }
}
