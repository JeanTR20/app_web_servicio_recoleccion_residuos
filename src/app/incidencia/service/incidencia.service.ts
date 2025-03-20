import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Reporte } from 'src/app/admin_residentereporte/interfaces/reporte.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  constructor(
    private http: HttpClient,

  ) { }

  // private _currenUser = signal<User| null>(null)

  // private currenUser = computed(() => this._currenUser)

  private readonly baseApiUrl: string = environment.baseUrl;


  registroIncidencia(descripcion: string, direccion:string, referencia_calle: string, foto:string, token_usuario:string){
    const ApiUrl = `${this.baseApiUrl}/reporte-incidencia`;
    const body = {descripcion, direccion, referencia_calle, foto, token_usuario};

    return this.http.post(ApiUrl, body)
  }

  listarMiReporte(token_usuario:string, estado: string){
    const apiUrl = `${this.baseApiUrl}/reporte-incidencia/listar-mi-reporte?token_usuario=${token_usuario}&estado=${estado}`;
    return this.http.get<Reporte[]>(apiUrl);
  }
}
