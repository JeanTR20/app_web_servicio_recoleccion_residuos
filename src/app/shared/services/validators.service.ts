import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ValidatorsService {
  constructor() { }

  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError(form: FormGroup, field: string) {
    if(!form.controls[field]) return null;

    const errors = form.controls[field].errors || {}

    for(const key of Object.keys(errors)){
      switch(key){
        case 'required':
          return 'El campo es requerido.'
        case 'minlength':
          return `Minimo ${errors['minlength'].requiredLength } números.`
      }
    }

    return null;
  }

  public getFieldErrorCaracteres(form: FormGroup, field: string){
    if(!form.controls[field]) return null;

    const errors = form.controls[field].errors || {}

    for(const key of Object.keys(errors)){
      switch(key){
        case 'required':
          return 'El campo es requerido.'
        case 'minlength':
          return `Minimo ${errors['minlength'].requiredLength } caracteres.`
      }
    }

    return null;
  }


  public  validatorInputNumber(event: KeyboardEvent){
    const pattern = /[0-9]/;

    if(!pattern.test(event.key)){
      event.preventDefault();
    }
  }

}
