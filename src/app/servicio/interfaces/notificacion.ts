export interface Notificacion {
  programar_id: number | null,
  programar_ruta: string;
  programar_dia: string;
  programar_hora: string;
  programar_activo: boolean;
  programar_fecha_creacion: string;
  programar_fecha_modificacion: string;
  programar_tipo: number;
}
