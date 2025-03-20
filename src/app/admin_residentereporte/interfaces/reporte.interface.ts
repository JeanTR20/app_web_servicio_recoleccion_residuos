export interface Reporte {
  usuario_id: number,
  usuario_carnet_identidad: string,
  incidencia_id: number;
  incidencia_descripcion: string;
  incidencia_direccion: string;
  incidencia_referencia_calle: string;
  incidencia_fecha_reporte: string;
  incidencia_foto: string;
  incidencia_foto_url?: string;
  incidencia_estado: boolean;
}
