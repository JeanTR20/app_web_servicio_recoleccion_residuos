import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { HorarioService } from '../../service/horario.service';
import { ServicioService } from 'src/app/servicio/services/servicio.service';
import { Horario } from 'src/app/servicio/interfaces/horario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Ruta } from '../../interfaces/ruta.interface';
import { Subject, takeUntil, map, debounceTime } from 'rxjs';
import { error } from 'toastr';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit, OnDestroy {

  horario: Horario[] = [];

  page: number = 1;
  sizePage:number = 20;
  loading:boolean = false;
  tieneMasDatos: boolean = true;
  textBusquedaAnterior:string = '';
  isLoading: boolean = false;

  ruta: Ruta[] = [];
  show: boolean = false;
  showEditar: boolean = false;
  showEliminar: boolean = false;
  showEliminarRuta: boolean = false;
  textBusqueda: string = '';
  rutaSeleccionada: number | null = null;
  diaSeleccionada: string | null = null;

  public idHorario: number | null = null;
  public idHorarioEliminar: number | null = null;


  private scrollEventListenerAdded = false;
  private justEdited = false;

  private destroy = new Subject<void>();

  constructor(
    private serviceService: ServicioService,
    private fb: FormBuilder,
    private horarioService: HorarioService,
  ) {}


  public myform: FormGroup = this.fb.group({
    ruta_nombre: ['',[Validators.required, Validators.maxLength(20)]],
    ruta_descripcion: ['', [Validators.required, Validators.maxLength(45)]]
  })

  public myform2: FormGroup = this.fb.group({
    dia: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
    hora_inicio: ['', [Validators.required, Validators.minLength(1)]],
    recorrido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    // referencia_punto: ['', [Validators.required, Validators.maxLength(500)]],
    ruta_id: ['', [Validators.required, Validators.min(1)]],
  })

  ngOnInit(){

    this.page = 1;
    this.horario = [];
    this.tieneMasDatos = true;

    this.diaSeleccionada='Dias';
    // this.listarHorario()
    this.loadHorario();

    this.listarruta();

    // setTimeout(() => {
    //   const container = document.querySelector('.flex-1') as HTMLElement;

    //   if (container) {

    //     container.addEventListener('scroll', (event) => {
    //       const element = event.target as HTMLElement;

    //       const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

    //       if (isAtBottom && !this.loading && this.tieneMasDatos ) {
    //         this.page++;
    //         this.loadHorario();
    //       }
    //     });
    //   }
    // }, 0);

    // Asegurarse de añadir el event listener solo una vez
    if (!this.scrollEventListenerAdded) {
      setTimeout(() => {
        const container = document.querySelector('.flex-1') as HTMLElement;
        if (container) {
          container.addEventListener('scroll', this.handleScroll);
          this.scrollEventListenerAdded = true; // Marcar que el listener ha sido añadido
        }
      }, 0);
    }

  }

  // Manejador de evento de scroll con debounce
  handleScroll = (() => {
    let timeout: ReturnType<typeof setTimeout>;
    return (event: Event) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const element = event.target as HTMLElement;
        const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

        if (isAtBottom && !this.loading && this.tieneMasDatos && !this.justEdited) {
          this.page++;
          this.loadHorario();
        }
      }, 100); // Debounce de 100ms
    };
  })();

  diasSemana = [
    'Dias',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ]

  seleccionarDia(dia:string | null){
    this.diaSeleccionada = dia;
    // this.listarHorario()
    this.page = 1;
    this.horario = [];
    this.tieneMasDatos = true;
    this.loadHorario()
  }

  seleccionarRuta(ruta: number | null){
    this.rutaSeleccionada = ruta;
    // this.listarHorario()
    this.page = 1;
    this.horario = [];
    this.tieneMasDatos = true;
    this.loadHorario()
  }

  loadHorario() {

    if (this.loading || !this.tieneMasDatos) return;

    // Verificar si los criterios de búsqueda han cambiado
    if (this.textBusqueda?.trim() !== this.textBusquedaAnterior) {
      this.page = 1;  // Reiniciar la paginación si cambian los criterios de búsqueda
      this.textBusquedaAnterior = this.textBusqueda?.trim(); // Actualizar el criterio de búsqueda anterior
    }

    // Asegúrate de convertir `null` a `undefined` para cumplir con los tipos esperados
    const ruta = Number(this.rutaSeleccionada) ?? undefined;
    const dia = this.diaSeleccionada ?? undefined;
    const recorrido = this.textBusqueda?.trim() || undefined;

    this.loading = true;

    this.horarioService.listarhorario(ruta, dia, recorrido, this.page, this.sizePage)
    .subscribe(data => {

      if (data.horario.length < this.sizePage) {
        this.tieneMasDatos = false;
      }

      if (this.page === 1) {
        this.horario = []; // Reinicia la lista si es una nueva búsqueda
      }

      if(data.horario.length > 0){
        data.horario.forEach(item => {
         const [hora, minuto] = item.horariopunto_hora_inicio.split(':').map(Number);
         const isPm = hora >= 12;
         const formatoHora = ((hora + 11) % 12 + 1);
         const suffix = isPm ? 'p.m.' : 'a.m.';
         item.horariopunto_hora_inicio = `${formatoHora}:${minuto.toString().padStart(2, '0')} ${suffix}`;
        });

        this.horario = [...this.horario, ...data.horario];
      }else {
        this.tieneMasDatos = false;
      }

      this.loading = false;
    }, error => {
      this.loading = false;
      this.tieneMasDatos = false;
    });
  }

  close(){
    this.show = false;
  }

  open(){
    this.show = true;
  }

  closeEditar(){
    this.showEditar = false;
    this.myform2.reset();
  }


  openEditar(id_horario: number){
    let id_ruta = Number(this.rutaSeleccionada)
    let dia = String(this.diaSeleccionada)
    let recorrido = this.textBusqueda

    this.horarioService.listarhorariofiltrado(id_ruta, dia, recorrido)
      .subscribe(horarios => {
        const horarioEdit = horarios.find(item => item.horariopunto_id === id_horario);
        if(horarioEdit){
          this.myform2.patchValue({
            ruta_id: horarioEdit.ruta_id,
            dia: horarioEdit.horariopunto_dia,
            hora_inicio: horarioEdit.horariopunto_hora_inicio,
            recorrido: horarioEdit.horariopunto_recorrido,
            referencia_punto: horarioEdit.horariopunto_referencia_punto,
          });
          this.showEditar = true;
          this.idHorario = horarioEdit.horariopunto_id;
        }
      })
  }

  closeEliminar(){
    this.showEliminar = false;
  }

  openEliminar(id_horario:number){
    this.showEliminar = true;
    this.idHorarioEliminar = id_horario;
  }

  borrarTexto(){
    this.textBusqueda = '';
    this.buscarPorRecorrido()
  }

  anadirruta(){
    const {ruta_nombre, ruta_descripcion} = this.myform.value;
    this.horarioService.anadirRuta(ruta_nombre, ruta_descripcion)
    .subscribe({
      next: () => {
        this.close();
        this.listarruta();
        // Swal.fire('success', 'Se registro exitosamente la ruta nueva', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo completar el registro. Por favor, intente de nuevo', 'error');
      }
    })
  }

  ngOnDestroy(): void{
 // Limpiar el EventListener cuando el componente se destruye
    const container = document.querySelector('.flex-1') as HTMLElement;
    if(container){
      container.removeEventListener('scroll', this.handleScroll)
    }

    this.destroy.next();
    this.destroy.complete();

  }

  closeEliminarRuta(){
    this.showEliminarRuta = false;
  }

  openEliminarRuta(){
    this.showEliminarRuta = true;
  }

  listarruta(){
    this.horarioService.listarRuta()
    .pipe(takeUntil(this.destroy))
    .subscribe(
      rutas => { this.ruta = rutas},
      // error => { console.error('Hubo un error al obtener las rutas', error)}
    )
  }

  deleteruta(id_ruta:number){

    this.horarioService.deleteRuta(id_ruta)
    .subscribe({
      next: () => {
        this.listarruta();
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo eliminar esta ruta. Por favor, intente de nuevo', 'error');
      }
    })
  }

  crearhorario(){

    if(!this.myform2.get('ruta_id')?.valid){
      Swal.fire('Error', 'El campo ruta no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform2.get('dia')?.valid){
      Swal.fire('Error', 'El campo dia no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform2.get('hora_inicio')?.valid){
      Swal.fire('Error', 'El campo hora_inicio esta vacio o incompleto', 'error');
      return;
    }

    if(!this.myform2.get('recorrido')?.valid){
      Swal.fire('Error', 'El campo recorrido no debe ser estar vacio', 'error');
      return;
    }

    const {dia, hora_inicio, recorrido, referencia_punto, ruta_id} = this.myform2.value;
    const [hora, minutos] = hora_inicio.split(':').map(Number);
    const horaDate = new Date();
    horaDate.setHours(hora, minutos, 0, 0);

    this.isLoading = true

    this.horarioService.crearHorario(dia, horaDate, recorrido, referencia_punto, ruta_id)
    .subscribe({
      next: () =>{
        this.rutaSeleccionada=null;
        // this.listarHorario();
        this.loadHorario()
        this.myform2.reset();
        // Swal.fire('success', 'Se creo exitosamente un nuevo horario', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo crear el horario. Por favor, intente de nuevo', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  editarhorario(id_horario: number){

    if(id_horario != null){
      const {dia, hora_inicio, recorrido, referencia_punto, ruta_id} = this.myform2.value;
      const [hora, minutos] = hora_inicio.split(':').map(Number);
      const horaDate = new Date();
      horaDate.setHours(hora, minutos, 0, 0);

      this.isLoading = true;
      this.horarioService.editarHorario(id_horario, dia, horaDate, recorrido, referencia_punto, ruta_id)
      .subscribe({
        next: () =>{
          this.closeEditar();
          // this.diaSeleccionada='Dias';
          // this.listarHorario();
          this.justEdited = true;
          setTimeout(() => this.justEdited = false, 3000);
          this.resetScrollPosition();

          this.page = 1;
          this.tieneMasDatos = true;
          this.loadHorario();
          this.myform2.reset();
          // Swal.fire('success', 'Se edito exitosamente el horario escogido', 'success');
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo editar el horario. Por favor, intente de nuevo', 'error');
        },
        complete: () =>{
          this.isLoading = false;
        }
      })
    }
  }

  resetScrollPosition() {
    const container = document.querySelector('.flex-1') as HTMLElement;
    container.scrollTop = 700;
  }

  deletehorario(id_horario: number){

    this.isLoading = true;

    this.horarioService.deleteHorario(id_horario)
    .subscribe({
      next: () => {
        // Swal.fire('success', 'Se elimnino un elemento exitosamente', 'success')
        this.closeEliminar();
        // this.diaSeleccionada='Dias';
        // this.rutaSeleccionada=1;
        // this.listarHorario()
        this.loadHorario()
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo eliminar el elemento. Por favor, intente de nuevo', 'error');
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  buscarPorRecorrido() {
    this.page = 1; // Reinicia la paginación cada vez que se realiza una nueva búsqueda
    this.tieneMasDatos = true;
    this.loadHorario();
  }

}

