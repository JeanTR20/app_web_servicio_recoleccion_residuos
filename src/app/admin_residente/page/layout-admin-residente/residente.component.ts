import { Component, OnDestroy, OnInit } from '@angular/core';
import { Residente } from '../../interfaces/residente';
import { ResidenteService } from '../../services/residente.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminPersonalService } from 'src/app/admin_adminpersonal/services/admin-personal.service';
import { error } from 'toastr';

@Component({
  selector: 'app-residente',
  templateUrl: './residente.component.html',
  styleUrls: ['./residente.component.css']
})
export class ResidenteComponent implements OnInit, OnDestroy{

  residente: Residente[] = [];
  page: number = 1;
  sizePage:number = 20;
  loading:boolean = false;
  tieneMasDatos: boolean = true;
  textBusquedaAnterior: string = '';

  textBusqueda: string = '';
  showEliminar: boolean = false;
  showEditar: boolean = false;
  idUsuario: number | null = null;

  showDarBaja: boolean = false;

  public idResidenteEditar: number | null = null;
  public contrasenaResidenteEditar: string | null = null;

  private scrollListener: any;

  constructor(
    private residenteService:ResidenteService,
    private adminPersonalService: AdminPersonalService,
    private fb: FormBuilder
  ){}

  public myformResidente: FormGroup = this.fb.group({
    telefono: ['', [Validators.required, Validators.maxLength(9)]],
    carnet_identidad: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    nombre_usuario: ['', [Validators.required, Validators.maxLength(15)]],
  })

  ngOnInit(): void {
    this.page = 1;
    this.residente = [];
    this.tieneMasDatos = true;

    this.loadResidente();
    // this.listarresidente();

    setTimeout(() => {
      const container = document.querySelector('.flex-1') as HTMLElement;

      if (container) {

        this.scrollListener = (event : Event) => {
          const element = event.target as HTMLElement;

          const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

          if (isAtBottom && !this.loading && this.tieneMasDatos ) {
            this.page++;
            this.loadResidente();
          }
        };

        container.addEventListener('scroll', this.scrollListener)
      }
    }, 0);
  }

  ngOnDestroy(): void {
    const container = document.querySelector('.flex-1') as HTMLElement;
    if(container && this.scrollListener){
      container.removeEventListener('scroll', this.scrollListener);
    }
  }

  borrarTexto(){
    this.textBusqueda = '';
    this.buscarResidente();
  }

  loadResidente(){

    const terminoBusqueda = this.textBusqueda?.trim();
    const isNumeroCarnet = /^\d{8,12}$/.test(terminoBusqueda);

    const numeroCarnet = isNumeroCarnet ?  terminoBusqueda: undefined;
    const nombreUsuario = !isNumeroCarnet ? terminoBusqueda : undefined;

    // Si ya estamos cargando o no hay más datos por cargar, salir
    if(this.loading || !this.tieneMasDatos) return;

    this.loading = true;

    // Llamada al servicio para listar residentes
    this.residenteService.listarResidente(numeroCarnet, nombreUsuario, this.page, this.sizePage)
    .subscribe(residentes => {
      // Verificamos si ya no hay más datos que cargar
      if(residentes.residente.length < this.sizePage){
        this.tieneMasDatos = false;
      }

      if (this.page === 1) {
        this.residente = []; // Reinicia la lista si es una nueva búsqueda
      }

      // Agregamos los nuevos datos a la lista existente
      if(residentes.residente.length > 0){
        this.residente = [...this.residente, ...residentes.residente]
      }else{
        this.tieneMasDatos = false;
      }

      this.loading = false;

      this.checkScroll()
    }, error => {
      this.loading = false;
    });
  }

  checkScroll():void{
    setTimeout(() => {
      const container = document.querySelector('.flex-1') as HTMLElement;

      // Si el contenedor existe y su altura total (scrollHeight) es menor o igual a la altura visible (clientHeight),
      // significa que no hay scroll, por lo tanto cargamos más datos si es posible
      if (container && container.scrollHeight <= container.clientHeight && this.tieneMasDatos && !this.loading) {
        this.page++; // Incrementamos la página
        this.loadResidente(); // Cargamos más datos
      }
    }, 100); // Timeout corto para dar tiempo al DOM a actualizar
  }

  buscarResidente(){

    this.page = 1;
    this.tieneMasDatos = true;
    this.loadResidente();
  }

  closeEliminar(){
    this.showEliminar = false;
  }

  openEliminar(id_usuario:number){
    this.showEliminar = true;
    this.idUsuario = id_usuario;
  }

  eliminarresidente(id_usuario:number){

    this.residenteService.eliminaResidente(id_usuario)
    .subscribe({
      next: () => {
        this.closeEliminar();
        // this.listarresidente();
        this.loadResidente();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar este elemento. Por favor, intente de nuevo', 'error');
      }
    })
  }

  closeEditar(){
    this.showEditar = false;
  }

  openEditar(id_usuario: number){
    this.showEditar = true;

    this.residenteService.listarResidenteFiltrado(undefined, undefined)
    .subscribe(residentes => {
      const residenteEdit = residentes.find(item => item.usuario_id === id_usuario);

      if(residenteEdit){
        this.myformResidente.patchValue({
          carnet_identidad: residenteEdit.usuario_carnet_identidad,
          nombre_usuario: residenteEdit.usuario_nombre_usuario,
          telefono: residenteEdit.usuario_telefono,
          contrasena: residenteEdit.usuario_contrasena,
        });
        this.idResidenteEditar = residenteEdit.usuario_id;
        this.contrasenaResidenteEditar = residenteEdit?.usuario_contrasena;
      }
    })
  }

  editarresidente(id_usuario: number){

    const {
      telefono,
      carnet_identidad,
      nombre_usuario
    } = this.myformResidente.value

    this.residenteService.editarResidente(id_usuario, telefono, carnet_identidad, nombre_usuario)
    .subscribe({
      next: () => {
        this.myformResidente.reset();
        this.closeEditar();
        // this.listarresidente();
        this.page = 1;
        this.residente = [];
        this.tieneMasDatos = true;
        this.loadResidente();
      },
      error: (err) => {
        const errorMessage = err.error.message || 'No se pudo editar el usuario del residente. Por favor, intente de nuevo'
        Swal.fire('Error', errorMessage,'error');
      }

    })

  }

  closeDarBaja(){
    this.showDarBaja = false;
  }

  openDarBaja(id_usuario: number){
    this.showDarBaja = true;
    this.idUsuario = id_usuario
  }

  darbajausuario(id_usuario: number){
    this.adminPersonalService.darBajaUsuario(id_usuario)
    .subscribe({
      next: () => {
        this.closeDarBaja();
        // this.listarresidente();
        this.loadResidente();
      },
      error: (error) =>{
        // console.error('error', error)
        Swal.fire('Error', 'No se pudo dar de baja al usuario personal. Por favor, intente de nuevo', 'error');
      }
    })
  }

  ValidarInputNumber(event: KeyboardEvent){
    const pattern = /[0-9]/;

    if(!pattern.test(event.key)){
      event.preventDefault();
    }
  }

}
