import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBbvaService } from '../../../services/api-bbva.service';
import { ValidatorsService } from '../../../services/validators.service';
import { LoadingDialogComponent } from '../../shared/dialogs/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  hide = true;
  chide = true;
  loginError: boolean;
 // listErrors = new ErrorsModel();

 constructor(
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,                             // Para uso de Dialogs
  private snackBar: MatSnackBar,                        // Alertas en forma de snackbar
  private owmValidators: ValidatorsService,
  private bbvaService: ApiBbvaService
) {
  this.loginError = false;
}

ngOnInit(): void {
  this.createRegisterForm();
}

private createRegisterForm(): void {
  this.registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50),Validators.minLength(2), Validators.pattern('^[a-z0-9A-ZÀ-ÿ\u00f1\u00d1 ]+(\s*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]+$')]],
    lastN: ['', [Validators.required, Validators.maxLength(50),Validators.minLength(2), Validators.pattern('^[a-z0-9A-ZÀ-ÿ\u00f1\u00d1 ]+(\s*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]+$')]],
    lastN2: ['', [Validators.required, Validators.maxLength(50),Validators.minLength(2), Validators.pattern('^[a-z0-9A-ZÀ-ÿ\u00f1\u00d1 ]+(\s*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]+$')]],
    email: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    password: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(6)]],
    cpassword: ['', [Validators.required]]
  }, {
    validators: this.owmValidators.comparePasswords('password', 'cpassword')
  });
}

onSubmit(): void {
  this.showLoading();
  this.checkValidForm();
}

private checkValidForm(): void {
  if (this.registerForm.invalid) {
    this.closeLoading();
    this.showNotification('danger', 'Error', 'top', 'rigth');              // Muestra notificación de error
    this.loginError = true;                                                // Muestra error
   // this.listErrors.errors.push({msj: 'Campos incorrectos por favor verifica los datos ingresados'});
    return Object.values(this.registerForm.controls).forEach(control => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach( control => control.markAsTouched());
      } else {
        control.markAsTouched();
      }
    });
  }
  this.doRegister();
}

private doRegister(): void {
  const reRmail = this.getFormValue('email');
  const reName =  this.getFormValue('name');
  const reLast =  this.getFormValue('lastN');
  const rePassword =  this.getFormValue('password');

  /******************* AQUI SERVICIO DE REGISTRO **************************/
  this.bbvaService.register(reRmail, reName, reLast, rePassword)
  .subscribe((data) => {
    console.log(data);
    this.closeLoading();
    this.showNotification('success', 'Se ha enviado un correo para validar cuenta', 'top', 'center');
    this.router.navigateByUrl('/auth/signin');
  }, (err: HttpErrorResponse) => {
    this.closeLoading();
    this.showNotification('danger', 'Error', 'top', 'center');
    console.log(err);
    this.loginError = true;
    // this.listErrors = err.error;
  });

  /************************************************/
}

private getFormValue(field: string): any {
  return this.registerForm.get(field).value;
}

public getError( field: string): string{
  // console.log(this.registerForm.get(form).errors);
  const errorForm = this.registerForm.get(field).errors;

  if (errorForm?.required){return `Este campo es requerido`; }

  if (errorForm?.minlength){return `Debe contener al menos ${errorForm?.minlength.requiredLength} caracteres`; }

  if (errorForm?.maxlength){return `Debe contener máximo ${errorForm?.maxlength.requiredLength} caracteres`; }

  if (errorForm?.pattern){return `No se permiten los caracteres especiales`; }
}

get nameValidators(): boolean {
  return this.registerForm.get('name').invalid && this.registerForm.get('name').touched;
}

get lastNValidators(): boolean {
  return this.registerForm.get('lastN').invalid && this.registerForm.get('lastN').touched;
}

get lastN2Validators(): boolean {
  return this.registerForm.get('lastN').invalid && this.registerForm.get('lastN').touched;
}

get emailvalidators(): any {
  return this.registerForm.get('email').invalid && this.registerForm.get('email').touched;
}

get passwordvalidators(): any {
  return this.registerForm.get('password').invalid && this.registerForm.get('password').touched;
}

get cpasswordvalidators(): any {
  const pass1 = this.registerForm.get('password').value;
  const pass2 = this.registerForm.get('cpassword').value;

  return ((pass1 === pass2) ? false : true ) && this.registerForm.get('cpassword').touched;
}

showLoading(): void{          // Mostrar dialog de cargando
  this.dialog.open(LoadingDialogComponent, {});
}

closeLoading(): void {       // Cerrar dialogs
  this.dialog.closeAll();
}

showNotification(colorName: string, text: string, placementFrom: any, placementAlign: any): void {  // Mostrar snackbar
  this.snackBar.open(text, '', {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: `snackbar-${colorName}`
  });
}

}
