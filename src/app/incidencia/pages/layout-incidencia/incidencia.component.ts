import { Component, computed, OnInit, ViewChild } from '@angular/core';
import { IncidenciaService } from '../../service/incidencia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthStatus } from 'src/app/auth/interfaces';
import { ToastrService } from 'ngx-toastr';
import { Storage, ref } from '@angular/fire/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { ReCaptcha2Component } from 'ngx-captcha';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incidencia',
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css']
})
export class IncidenciaComponent implements OnInit {

  public user = computed(() => this.authService.currentUser());
  public authStatus = computed(() => this.authService.authStatus());

  public siteKey = "6LcQ0OwpAAAAANgP_kfAI6cgiBR82Ri1EaHbbrBk";

  isLoading: boolean = false;

  @ViewChild('captchaElem', {static:true}) captchaElem: ReCaptcha2Component | null = null;

  myform!: FormGroup;

  constructor(
    private authService: AuthService,
    private incidenciaService: IncidenciaService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: Storage,

    private route: Router
  ){}

  ngOnInit(): void {

    window.addEventListener('beforeunload', () => this.captchaElem?.resetCaptcha())

    this.myform = this.fb.group({
      descripcion: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      referencia_calle: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]]
    });
  }

  fileName: string = ''
  selectedFile: File | null = null;

  archivoSeleccionado(event: Event): void{
    const elemento = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = elemento.files;
    if(fileList){
      this.fileName = fileList[0].name
      this.selectedFile = fileList[0]
    }
  }


  registrarIncidenciaReporte(){
    if(this.authService.authStatus() === AuthStatus.authenticated){

      if(!this.myform.valid || !this.selectedFile){
        this.toastr.error('Faltan completar campos requeridos', 'Error');
        Object.keys(this.myform.controls).forEach( field =>{
          const control = this.myform.get(field);
          control?.markAsTouched({onlySelf: true});
        })
        return;
      }


      let folderPath = this.user()?.rol_nombre === 'Recolector' ? 'collector incident report/' : 'resident incident report/'

      const file = this.selectedFile;

      //uso de time para evitar que no sustiya el archivo o imagen existente con el mismo nombre
      const timeStamp = Date.now();
      const imgRef = ref(this.storage,  `images/${folderPath}${timeStamp}_${file.name}`)

      // Activa el indicador de carga al iniciar el proceso
      this.isLoading = true;

      // Sube el archivo
      uploadBytes(imgRef, file)
      .then((snapshot) => {

        getDownloadURL(snapshot.ref)
        .then((url) => {

          const {descripcion, direccion, referencia_calle} = this.myform.value;
          const foto_url = url
          const token_usuario = localStorage.getItem('token') || ''

          this.incidenciaService.registroIncidencia(descripcion, direccion, referencia_calle, foto_url, token_usuario)
          .subscribe({
            next: () => {
              this.toastr.success('Se envió el registro exitosamente')
              this.myform.reset();

              if(this.captchaElem){
                this.captchaElem.resetCaptcha();
              }
            },
            error: (error) =>{
               // console.error('Error:', error.error),
              this.toastr.error(error.error, 'Error')
            },
            complete: () => {
              this.isLoading = false;
            }
          });
        });
      }).catch(error => {
        // Maneja cualquier error que ocurra durante la carga
       // console.error('Error al subir la imagen:', error);
        this.toastr.error('Error al subir la imagen', 'Error');
      });

    }else{
      this.toastr.error('Para realizar esta acción, necesitar iniciar sesión.', 'Error')
      this.route.navigateByUrl('/autenticacion/iniciar_sesion')
    }
  }

  handleSuccess(token: string){
    this.myform.controls['recaptcha'].setValue(token);
    //console.log('Captcha succcess', token)
  }
}
