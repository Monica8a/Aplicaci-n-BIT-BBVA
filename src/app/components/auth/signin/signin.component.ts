import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HttpErrorResponse } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { LoadingDialogComponent } from '../../shared/dialogs/loading-dialog/loading-dialog.component';
import { ApiBbvaService } from '../../../services/api-bbva.service';

declare const $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  rememberUser: boolean;
  loginError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,                             // Para uso de Dialogs
    private snackBar: MatSnackBar,                        // Alertas en forma de snackbar
    private bbvaService: ApiBbvaService,
    // private authService: AuthService,
  ) {
    this.rememberUser = false;
    this.loginError = false;
  }

  ngOnInit(): void {
    this.createLoginForm();
  }

  private createLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.showLoading();
    this.checkValidForm();
  }

  private checkValidForm(): any {
    if (this.loginForm.invalid) {
      this.closeLoading();
      this.showNotification('danger', 'Error', 'top', 'rigth');              // Muestra notificación de error
      this.loginError = true;                                                // Muestra error
      // this.listErrors.errors.push({msj: 'Campos incorrectos por favor verifica los datos ingresados'});
      return Object.values(this.loginForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control2) => {
            return control2.markAsTouched();
          });
        } else {
          control.markAsTouched();
        }
      });
    }
    this.doLogin();
  }

  private doLogin(): any {                // Lógica de inicio de sesión

    const loginEmail = this.loginForm.get('email').value;
    const loginPass = this.loginForm.get('password').value;

    console.log(loginEmail); console.log(loginPass);

    /**************** AQUI SE MODIFICA *******************/
    this.bbvaService.login(loginEmail, loginPass)    // Api de login
      .subscribe((data) => {
        console.log(data);
        this.closeLoading();
        localStorage.setItem('token', 'true');
        localStorage.setItem('email', loginEmail);
        this.loginForm.reset();
        this.showNotification('success', 'Ingreso Correcto', 'top', 'right');
        this.router.navigateByUrl('/app/home');
      }, (err: HttpErrorResponse) => {
        this.closeLoading();
        this.showNotification('danger', 'Error', 'top', 'rigth');
        this.loginError = true;
        // this.listErrors = err.error;
      });
    /*******************************************************/
  }

  get emailValidate(): boolean {
    return this.loginForm.get('email').invalid && this.loginForm.get('email').touched;
  }

  get passwordValidate(): boolean {
    return this.loginForm.get('password').invalid && this.loginForm.get('password').touched;
  }

  /******************* Acciones de dialogs ***************************/
  showLoading(): void {          // Mostrar dialog de cargando
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
