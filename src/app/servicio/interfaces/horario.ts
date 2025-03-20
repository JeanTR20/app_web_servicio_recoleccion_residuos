
export interface Horario {
  horariopunto_id:         number;
  horariopunto_dia:         string;
  horariopunto_hora_inicio: string;
  horariopunto_recorrido:      string;
  horariopunto_referencia_punto?:   string;
  ruta_id: number;
  ruta_nombre: string;
  rowspan?: number;
  cambioDiaIndex?: number;
}

