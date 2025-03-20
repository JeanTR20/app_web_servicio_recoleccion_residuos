import { Component, ElementRef, HostListener, OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ruta } from 'src/app/admin_horario/interfaces/ruta.interface';
import { HorarioService } from 'src/app/admin_horario/service/horario.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Horario } from 'src/app/servicio/interfaces/horario';
import { Notificacion } from 'src/app/servicio/interfaces/notificacion';
import { ServicioService } from 'src/app/servicio/services/servicio.service';
import Swal from 'sweetalert2';
import { error } from 'toastr';

type Dropdown = 'ruta'| 'dia' | 'notificacion'| 'notificacion2' ;

@Component({
  selector: 'app-layout-horario',
  templateUrl: './layout-horario.component.html',
  styleUrls: ['./layout-horario.component.css']
})
export class LayoutHorarioComponent implements OnInit {

  horarioActualizado: Horario[]=[];
  ruta: Ruta[]=[];
  programarNotificacion: Notificacion[]=[];
  programarNotificacionTipo1:Notificacion[] = [];
  programarNotificacionTipo2:Notificacion[] = [];

  constructor(
    private elementRef: ElementRef,
    private servicioService: ServicioService,
    private horarioService: HorarioService,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: Router
  ) {

  }

  public user = computed(() => this.authService.currentUser());
  public authStatus = computed(() => this.authService.authStatus());

  center = {lat: -12.106108523633738, lng:-75.2166813592593};

  isOpenDia = false;
  isOpenNotificacion = false;
  isOpenNotificacion2 = false;
  isOpenRuta = false;

  showNotificaciones = false;
  showNotificaciones2 = false;

  diaSeleccionada: string | null = null;
  rutaSeleccionada: string | null = null;
  notificacionSeleccionada: string | null = null;
  notificacionSeleccionada2: string | null = null;

  diaSele: string | null = null;
  rutaSele: string | null = null;
  horaSele: string | null = null;

  isLoading: boolean = false;

  contadorCambioDia = 0;
  diaActual = '';

  diasSemana = [
    'Todos',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo'
  ]

  notificacion = [
    'Personalizar',
    'Ninguna'
  ]

  notificacion2 = [
    'Personalizar',
    'Ninguna'
  ]

  public myformNotificacion: FormGroup = this.fb.group({
    dia: ['', [Validators.required, Validators.maxLength(10)]],
    hora: ['', [Validators.required]],
    tipo_programacion: [1]
  })

  public myformNotificacion2: FormGroup = this.fb.group({
    dia: ['', [Validators.required, Validators.maxLength(10)]],
    hora: ['', [Validators.required]],
    tipo_programacion: [2]
  })

  ngOnInit(): void {
    this.rutaSeleccionada = "Ruta N° 1";
    this.diaSeleccionada = 'Todos';
    this.listarHorarioactualizado('');
    this.listarruta();
    this.obtenerdataNotificacion();

  }

  toogleDropdown( dropdown:Dropdown ){
    this.isOpenRuta = dropdown === 'ruta' ? !this.isOpenRuta: false;
    this.isOpenDia = dropdown === 'dia' ? !this.isOpenDia: false;
    this.isOpenNotificacion = dropdown === 'notificacion' ? !this.isOpenNotificacion: false;
    this.isOpenNotificacion2 = dropdown === 'notificacion2' ? !this.isOpenNotificacion2: false;
  }

  closeAllDropdowns(){
    this.isOpenDia = false;
    this.isOpenNotificacion = false;
    this.isOpenNotificacion2 = false;
    this.isOpenRuta = false;

    this.closeNotificaciones(1);
    this.closeNotificaciones(2);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeAllDropdowns();
    }
  }

  listarruta(){
    this.horarioService.listarRuta()
    .subscribe( rutas => {
      this.ruta = rutas
    })
  }

  closeNotificaciones(tipo_programacion: 1 | 2){
    if(tipo_programacion === 1){
      this.showNotificaciones = false;
    }

    if(tipo_programacion === 2){
      this.showNotificaciones2 = false;
    }
  }

  seleccionarOpcion(tipo:Dropdown, valor: string){
    if(tipo === 'dia' && this.isOpenDia){
      this.diaSeleccionada = valor;
      this.isOpenDia = false;
    }

    if(tipo === 'ruta' && this.isOpenRuta){
      this.rutaSeleccionada = valor;
      this.isOpenRuta = false;
    }

    this.listarHorarioactualizado('');
  }

  seleccionarNotificacion(notificacion: string, tipo: 'notificacion' | 'notificacion2'){

    if(tipo === 'notificacion' && this.isOpenNotificacion){
      this.notificacionSeleccionada = notificacion;
      this.isOpenNotificacion2 = false;
    } else if (tipo === 'notificacion2' && this.isOpenNotificacion2){
      this.notificacionSeleccionada2 = notificacion;
      this.isOpenNotificacion = false;
    }

    if(notificacion === 'Personalizar'){
      if(this.authService.currentUser() != null){
        if (tipo === 'notificacion') {
          this.showNotificaciones = true;
        }

        if (tipo === 'notificacion2'){
          this.showNotificaciones2 = true;
        }

      } else {
        this.route.navigateByUrl('/autenticacion/iniciar_sesion')
        Swal.fire('Error', 'Necesitas iniciar sesión para realizar esta acción', 'error');
      }
    }

    if(notificacion === 'Ninguna'){

      if(tipo === 'notificacion'){
        this.isOpenNotificacion = false;
      }

      if(tipo === 'notificacion2'){
        this.isOpenNotificacion2 = false
      }

      const tipo_programacion = tipo === 'notificacion' ? 1 : 2;
      this.cancelarNotificacion(tipo_programacion);
    }

  }


  listarHorarioactualizado(recorrido?: string){
    //me trae resultado de un digito de un string
    const id_ruta = parseInt(String(this.rutaSeleccionada)?.replace(/\D/g, ''), 10);
    const dia = String(this.diaSeleccionada);

    this.servicioService.listarHorarioByRutaYDia(id_ruta, dia, recorrido)
      .subscribe(horarios => {
        horarios.forEach(item => {
          const [hora, minuto] = item.horariopunto_hora_inicio.split(':').map(Number);
          const isPm = hora >= 12;
          const formatoHora = ((hora + 11) % 12 + 1);
          const suffix = isPm ? 'p.m.' : 'a.m.';
          item.horariopunto_hora_inicio = `${formatoHora}:${minuto.toString().padStart(2, '0')} ${suffix}`;
        });
        this.horarioActualizado = this.agruparHorariosPorDia(horarios);
        // this.colorActual = horarios[0] && horarios[0].horariopunto_dia === 'Lunes';
      });
  }

  agruparHorariosPorDia(horarios: Horario[]) {
    // Reiniciar valores para el seguimiento de días.
    this.contadorCambioDia = 0;
    this.diaActual = '';

    // Objeto para mantener el conteo de horarios por día.
    const conteoDias: { [key: string]: number } = {};
    // Objeto para almacenar el índice de cambio de día para cada día.
    const cambioDiaIndices: { [key: string]: number } = {};

    horarios.forEach(horario => {
      const key = horario.horariopunto_dia;
      if (!conteoDias[key]) {
        conteoDias[key] = 1;
        // Aquí asignamos un índice único para cada nuevo día.
        cambioDiaIndices[key] = ++this.contadorCambioDia;
      } else {
        conteoDias[key]++;
      }
    });

    // Asignar el valor de rowspan y cambioDiaIndex a cada horario.
    return horarios.map(horario => ({
      ...horario,
      rowspan: conteoDias[horario.horariopunto_dia],
      cambioDiaIndex: cambioDiaIndices[horario.horariopunto_dia]
    }));
  }

  async onSubmit(form: FormGroup){

   try {
    if(form.invalid){
      Swal.fire('Error', 'Faltan campos requeridos o los datos no son válidos', 'error');
      return;
    }

    const tipo = form.get('tipo_programacion')?.value

    const formValue = form.value;
    const suscripcion = await this.servicioService.checkAndRequestSubscription();

    if(!suscripcion){
      Swal.fire('Error', 'No se pudo verificar la suscripción', 'error')
      return;
    }

    const data = {
      suscripcion: suscripcion,
      ...formValue
    };

    this.isLoading = true;

    await this.servicioService.programarNotificacion(data)

    this.closeNotificaciones(tipo);
    this.obtenerdataNotificacion();
    Swal.fire('!Programación exitoso!', 'Se le notificará en el horario programado', 'success')

    } catch (error) {
      if(error instanceof Error){
        Swal.fire('Error', error.message, 'error')
      } else{
        Swal.fire('Error', 'Se ha producido un error desconocido', 'error');
      }
    } finally {
      this.isLoading = false; //oculta el indicador de carga
    }
  }

  formatHora(horaCompleta:string){
    return horaCompleta.substr(0, 5);
  }

  obtenerdataNotificacion(){
    this.servicioService.obtenerDatosNotificacion()
    .subscribe(data => {

      this.programarNotificacionTipo1 = [];
      this.programarNotificacionTipo2 = [];

      this.programarNotificacion = data.map(notificacion => {
        return {
          ...notificacion,
          programar_hora: this.formatHora(notificacion.programar_hora)
        }
      });

      const notificacion1 = this.programarNotificacion.find(n => n.programar_tipo === 1);
      const notificacion2 = this.programarNotificacion.find(n => n.programar_tipo === 2)!;

      //Asignar la primera programación a myformNotificacion
      if(notificacion1){
        this.programarNotificacionTipo1.push(notificacion1)
        this.myformNotificacion.setValue({
          dia: notificacion1.programar_dia,
          hora: notificacion1.programar_hora,
          tipo_programacion: notificacion1.programar_tipo
        })

        this.notificacionSeleccionada = notificacion1.programar_activo ? 'Personalizar' : 'Ninguna';
      } else{
        // Valores predeterminados para Tipo 1
        this.programarNotificacionTipo1.push({
          programar_id: null,
          programar_ruta: '',
          programar_dia: '',
          programar_hora: '',
          programar_activo: false,
          programar_fecha_creacion: '',
          programar_fecha_modificacion: '',
          programar_tipo: 1
        })
      }


      if(notificacion2){
        this.programarNotificacionTipo2.push(notificacion2)
        this.myformNotificacion2.setValue({
          dia: notificacion2.programar_dia,
          hora: notificacion2.programar_hora,
          tipo_programacion: notificacion2.programar_tipo
        })

        this.notificacionSeleccionada2 = notificacion2.programar_activo ? 'Personalizar' : 'Ninguna'
      } else {
        // Valores predeterminados para Tipo 1
        this.programarNotificacionTipo2.push({
          programar_id: null,
          programar_ruta: '',
          programar_dia: '',
          programar_hora: '',
          programar_activo: false,
          programar_fecha_creacion: '',
          programar_fecha_modificacion: '',
          programar_tipo: 2
        })
      }

    }, error =>{
      // console.error('Error al cargar datos programado', error)
    })
  }

  cancelarNotificacion(tipo_programacion: number){
    this.servicioService.cancelarNotificacion(tipo_programacion)
    .subscribe({
    })
  }
}
