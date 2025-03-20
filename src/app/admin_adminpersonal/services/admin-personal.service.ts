import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Personal } from '../interfaces/personal.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminPersonalService {

  private baseApiUrl: string = environment.baseUrl;

  // public currentPersonal = signal<Personal[]| null>(null)

  constructor(
    private http: HttpClient
  ) { }

  listarPersonal(numero_carnet?: string, apellidos_nombres?: string){
    let params = new HttpParams();

    if(numero_carnet){
      params = params.set('numero_carnet', numero_carnet);
    }

    if(apellidos_nombres){
      params = params.set('apellidos_nombres', apellidos_nombres);
    }
    const apiUrl = `${this.baseApiUrl}/admin-personal?estado=1`;
    return this.http.get<Personal[]>(apiUrl, {params: params})
  }

  crearPersonal(
    nombre_completo: string,
    apellido_paterno: string,
    apellido_materno: string,
    fecha_nacimiento: string,
    direccion: string,
    telefono: string,
    tipo_carnet: string,
    carnet_identidad: string,
    genero: string,
    correo: string,
    nombre_usuario: string,
    contrasena: string
  ){
    const apiUrl = `${this.baseApiUrl}/usuario/crear-personal`
    const body = {
      nombre_completo,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      direccion,
      telefono,
      tipo_carnet,
      carnet_identidad,
      genero,
      correo,
      nombre_usuario,
      contrasena
    }
    return this.http.post(apiUrl, body)
  }

  editarPersonal(
    id_usuario: number,
    nombre_completo: string,
    apellido_paterno: string,
    apellido_materno: string,
    fecha_nacimiento: string,
    direccion: string,
    telefono: string,
    tipo_carnet: string,
    carnet_identidad: string,
    genero: string,
    correo: string,
    nombre_usuario: string,
  ){
    const apiUrl = `${this.baseApiUrl}/usuario/actualizar-personal/${id_usuario}`;
    const body = {
      nombre_completo,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      direccion,
      telefono,
      tipo_carnet,
      carnet_identidad,
      genero,
      correo,
      nombre_usuario,
    };
    return this.http.patch(apiUrl, body);
  }

  darBajaUsuario(id_usuario: number){
    const apiUrl = `${this.baseApiUrl}/usuario/dar-baja-cuenta/${id_usuario}`;
    return this.http.patch(apiUrl, {});
  }

}
