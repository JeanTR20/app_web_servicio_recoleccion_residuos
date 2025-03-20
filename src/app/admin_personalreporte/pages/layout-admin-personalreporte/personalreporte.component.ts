import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonalReporteService } from '../../services/personal-reporte.service';
import { Reporte } from 'src/app/admin_residentereporte/interfaces/reporte.interface';
import { Subject, debounceTime } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personalreporte',
  templateUrl: './personalreporte.component.html',
  styleUrls: ['./personalreporte.component.css']
})
export class PersonalreporteComponent implements OnInit {

  @Input() totalPaginas = 0;
  @Input() paginaActual = 1;
  @Output() nuevaPagina = new EventEmitter<number>();

  reporte: Reporte[] = [];
  paginas: (number | string)[] = [];
  mostrarInicioEllipsis: boolean = false;
  mostrarFinEllipsis: boolean = false;

  termino_busqueda = ''
  estadoSeleccionado: string = ''
  loading = false;

  showEliminatReporte:boolean = false;

  public idIncidenciaEliminar: number | null = null;

  private updateEstadoSubject  = new Subject<{id_incidencia: number, estado: boolean}>

  constructor(
    private personalReporteService: PersonalReporteService
  ){
    this.updateEstadoSubject.pipe(
      debounceTime(500)
    ).subscribe(({id_incidencia, estado}) => {
      this.updatecambioEstado(id_incidencia, estado)
      this.loading = false;
    })
  }

  ngOnChanges(): void {
    this.construirPaginacion();
  }

  ngOnInit(): void {
    this.listarreportepersonal()
  }

  seleccionarEstado(estado : string){
    this.estadoSeleccionado = estado;
    this.borrarTexto();
    this.listarreportepersonal();
  }

  onChange(event: Event, item: any): void {
    const selectElement = event.target as HTMLSelectElement;
    // console.log(selectElement.value); // Esto debería imprimir '0' o '1'
    item.incidencia_estado = Number(selectElement.value);
  }

  borrarTexto(){
    this.termino_busqueda = '';
    this.buscarincidencia();
  }

  listarreportepersonal(){

    const terminoBusqueda = this.termino_busqueda?.trim();
    const isfecha = /^(\d{4}-\d{2}-\d{2})$/.test(terminoBusqueda);

    const fecha = isfecha ?  terminoBusqueda: undefined;
    const direccion = !isfecha ? terminoBusqueda : undefined;

    const estado = this.estadoSeleccionado;
    const page = this.paginaActual;
    const sizePage = 20;

    this.personalReporteService.listarReporteIncidenciaPersonal(direccion, fecha, estado, page, sizePage)
    .subscribe(reportes => {

      this.reporte = reportes.incidencia.map(item => {
        const url = item.incidencia_foto;
        const urldecodificada = decodeURIComponent(item.incidencia_foto);
        const ultimosegmento = urldecodificada.split('/').pop() || '';
        const nombreImagen = 'imagen';

        return {
          ...item,
          incidencia_foto: nombreImagen,
          incidencia_foto_url: url,
        };
      });

      this.totalPaginas = Math.ceil(reportes.totalIncidencia / sizePage);
      this.construirPaginacion();
    })
  }

  construirPaginacion() {
    this.paginas = [];
    const rango = 4; // Números adicionales a mostrar antes y después de la página actual

    // Caso especial para el inicio (mostrar del 1 al 10 si la página actual es 10 o menos)
    if (this.paginaActual <= 6) {
      for (let i = 1; i <= Math.min(10, this.totalPaginas); i++) {
        this.paginas.push(i);
      }
      if (this.totalPaginas > 10) {
        this.paginas.push('...');  // Para indicar salto de páginas
        this.paginas.push(this.totalPaginas); // Añadir la última página
      }
      return; // Finalizar la función después de configurar las páginas iniciales
    }

    let inicio = Math.max(1, this.paginaActual - rango); // Asegura que el inicio sea al menos 1
    let fin = Math.min(this.totalPaginas, this.paginaActual + rango); // Asegura que no exceda el total de páginas

    this.mostrarInicioEllipsis = inicio > 2;
    this.mostrarFinEllipsis = fin < this.totalPaginas - 1;

    // Siempre incluir la primera página si no está ya incluida
    if (inicio > 1) {
      this.paginas.push(1);
      if (inicio > 2) {
        this.paginas.push('...'); // Para indicar salto de páginas
      }
    }

    // Añadir páginas al array desde 'inicio' hasta 'fin'
    for (let i = inicio; i <= fin; i++) {
      this.paginas.push(i);
    }

    // Siempre mostrar la última página si no está en el rango actual
    if (fin < this.totalPaginas) {
      if (fin < this.totalPaginas - 1) {
        this.paginas.push('...'); // Para indicar salto de páginas
      }
      this.paginas.push(this.totalPaginas);
    }
  }


  seleccionarPagina(pagina:number | string){
    if(typeof pagina === 'number'){
      this.paginaActual = pagina;
      this.nuevaPagina.emit(pagina);
      this.listarreportepersonal();
      this.construirPaginacion();
    }
  }

  esNumero(valor: any): boolean {
    return typeof valor === 'number';
  }

  buscarincidencia(){
    this.paginaActual = 1;
    this.listarreportepersonal();
  }


  onCambioEstado(id_incidencia: number, estado: boolean){
    this.loading = true;
    this.updateEstadoSubject.next({id_incidencia, estado})
  }

  //actualizar cambios de estado de reporte de incidentes

  updatecambioEstado(id_incidencia: number, estado:boolean){
    this.personalReporteService.actualizarCambiosEstado(id_incidencia, estado)
    .subscribe({
      next: () => {
        this.estadoSeleccionado = '';
        this.listarreportepersonal()
      },
      error: (error) => {
        // console.error('Error durante la actualizacion:', error);
        Swal.fire('Error', 'No se pudo completar la actualizacion del estado. Por favor, intente de nuevo', 'error');
      }
    })
  }

  closeReporteIncidencia(){
    this.showEliminatReporte = false;
  }

  openReporteIncidencia(id_reporte: number){
    this.showEliminatReporte = true;
    this.idIncidenciaEliminar = id_reporte;
  }

  eliminarreporte(id_reporte: number){
    this.personalReporteService.eliminarReporte(id_reporte)
    .subscribe({
      next: () =>{
        this.closeReporteIncidencia();
        this.listarreportepersonal();
      },
      error: (err) =>{

        Swal.fire('Error', 'No se pudo completar eliminar el reporte de incidencia. Por favor, intente de nuevo', 'error');
      }
    })
  }

}
