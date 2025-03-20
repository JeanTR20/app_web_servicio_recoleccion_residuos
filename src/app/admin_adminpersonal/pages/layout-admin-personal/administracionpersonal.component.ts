import { Component, OnInit } from '@angular/core';
import { Personal } from '../../interfaces/personal.interface';
import { AdminPersonalService } from '../../services/admin-personal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administracionpersonal',
  templateUrl: './administracionpersonal.component.html',
  styleUrls: ['./administracionpersonal.component.css']
})
export class AdministracionpersonalComponent implements OnInit {

  personal:Personal[]=[];

  textBusqueda: string = '';
  fechaNacimiento: string = '';
  showEditar: boolean = false;
  showDarBaja: boolean = false;

  public idPersonalEditar: number | null = null;
  public contrasenaPersonalEditar: string | null = null;
  public idUsuario: number | null = null;

  constructor(
    private adminPersonalService: AdminPersonalService,
    private fb: FormBuilder
  ){}

  public myform: FormGroup = this.fb.group({
    nombre_completo: ['', [Validators.required, Validators.maxLength(40)]],
    apellido_paterno: ['', [Validators.required, Validators.maxLength(30)]],
    apellido_materno: ['', [Validators.required, Validators.maxLength(30)]],
    fecha_nacimiento: ['', [Validators.required]],
    direccion: ['', [Validators.required, Validators.maxLength(100)]],
    telefono: ['', [Validators.required, Validators.maxLength(9)]],
    tipo_carnet: ['', [Validators.required, Validators.maxLength(50)]],
    carnet_identidad: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    genero: ['', [Validators.required, Validators.maxLength(10)]],
    correo: ['', [Validators.required, Validators.maxLength(255), Validators.email]],
    nombre_usuario: ['', [Validators.required, Validators.maxLength(15)]],
    contrasena: ['', [Validators.required, Validators.maxLength(255)]],
  })

  ngOnInit(): void {
    this.listarpersonal();
  }

  borrarTexto(){
    this.textBusqueda = '';
    this.buscarpersonal();
  }

  listarpersonal(){
    this.adminPersonalService.listarPersonal()
    .subscribe(personals => {
      this.personal = personals
    });
  }

  crearpersonal(){

    if(!this.myform.get('nombre_completo')?.valid){
      Swal.fire('Error', 'El campo nombre completo no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('apellido_paterno')?.valid){
      Swal.fire('Error', 'El campo apellido paterno no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('apellido_materno')?.valid){
      Swal.fire('Error', 'El campo apellido materno no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('fecha_nacimiento')?.valid){
      Swal.fire('Error', 'El campo fecha de nacimiento no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('genero')?.valid){
      Swal.fire('Error', 'El campo género no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('direccion')?.valid){
      Swal.fire('Error', 'El campo dirección no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('telefono')?.valid){
      Swal.fire('Error', 'El campo teléfono no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('correo')?.valid){
      Swal.fire('Error', 'El campo carnet identidad no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('tipo_carnet')?.valid){
      Swal.fire('Error', 'El campo tipo carnet no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('carnet_identidad')?.valid){
      Swal.fire('Error', 'El campo carnet identidad no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('nombre_usuario')?.valid){
      Swal.fire('Error', 'El campo nombre usuario no debe ser estar vacio', 'error');
      return;
    }

    if(!this.myform.get('contrasena')?.valid){
      Swal.fire('Error', 'El campo contraseña no debe ser estar vacio', 'error');
      return;
    }


    const {
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
    } = this.myform.value

    this.adminPersonalService.crearPersonal(
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
    ).subscribe({
      next: () => {
        this.listarpersonal()
        Swal.fire('success', 'Se registro exitosamente el usuario del personal', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo completar el registro. Por favor, intente de nuevo', 'error');
      }
    })
  }

  closeEditar(){
    this.showEditar = false;
  }

  openEditar(id_usuario: number){

    this.adminPersonalService.listarPersonal()
    .subscribe(personal => {
      const personalEdit = personal.find(item => item.usuario_id === id_usuario);
      if(personalEdit){

        const partes = personalEdit?.apellidos_nombres.split(' ');

        const apellido_paterno = partes[0];
        const apellido_materno = partes[1];
        const nombre_completo = partes.slice(2).join(' ');

        const fechaNacimiento = personalEdit.usuario_fecha_nacimiento.slice(0, 10);

        this.myform.patchValue({
          nombre_completo: nombre_completo,
          apellido_paterno: apellido_paterno,
          apellido_materno: apellido_materno,
          fecha_nacimiento: fechaNacimiento,
          direccion: personalEdit.usuario_direccion,
          telefono: personalEdit.usuario_telefono,
          tipo_carnet: personalEdit.usuario_tipo_carnet,
          carnet_identidad: personalEdit.usuario_carnet_identidad,
          genero: personalEdit.usuario_genero,
          correo: personalEdit.usuario_correo,
          nombre_usuario: personalEdit.usuario_nombre_usuario,
        });
        this.showEditar = true;
        this.idPersonalEditar = personalEdit.usuario_id;
        this.contrasenaPersonalEditar = personalEdit.usuario_contrasena;
      }
    })
  }

  editarpersonal(id_usuario: number){
    const {
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
    } = this.myform.value;

    this.adminPersonalService.editarPersonal(
      id_usuario,
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
    ).subscribe({
      next: () => {
        this.myform.reset();
        this.closeEditar()
        this.listarpersonal();
      },
      error: (err) => {
        const errorMessage = err.error.message || 'No se pudo editar el usuario del personal. Por favor, intente de nuevo'
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
        this.listarpersonal();
      },
      error: (error) =>{
        Swal.fire('Error', 'No se pudo dar de baja al usuario personal. Por favor, intente de nuevo', 'error');
      }
    })
  }
  buscarpersonal(){
    const isNumeroCarnet = /^\d{8,12}$/.test(this.textBusqueda);

    if(isNumeroCarnet){
      const numero_carnet = this.textBusqueda;

      this.adminPersonalService.listarPersonal(numero_carnet, undefined)
      .subscribe(personals => {
        this.personal = personals;
      });
    }else if(this.textBusqueda){
      const apellidos_nombres = this.textBusqueda;
      this.adminPersonalService.listarPersonal(undefined, apellidos_nombres)
      .subscribe(personals => {
        this.personal = personals;
      });
    } else {
      this.adminPersonalService.listarPersonal(undefined, undefined)
      .subscribe(personals => {
        this.personal = personals;
      });
    }
  }
}

