import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuyCriptoComponent } from '../../shared/dialogs/buy-cripto/buy-cripto.component';
import { LoadingDialogComponent } from '../../shared/dialogs/loading-dialog/loading-dialog.component';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ApiBbvaService } from '../../../services/api-bbva.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  userEmail: string;
  flagError = false;
  loading = true;

  constructor(
    private bbvaService: ApiBbvaService,
    private snackBar: MatSnackBar,                        // Alertas en forma de snackbar
    public dialog: MatDialog,                             // Para uso de Dialogs
  ) { }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('email');
    this.showLoading();
    /**************** SERVICIO (Precio de criptomonedas) *******************/
    this.bbvaService.costCrypto()
    .subscribe((data) => {
      console.log(data);
      this.closeLoading();
      this.flagError = false;
      this.loading = false;
      // this.showNotification('success', 'Listo', 'top', 'right');
    }, (err: HttpErrorResponse) => {
      this.flagError = true; this.loading = false;
      this.closeLoading();
      this.showNotification('danger', 'Error', 'top', 'rigth');
    });
    /*******************************************************/
  }

  onBuy(): void{
    /**************** INTERFAZ (CAMPOS DE POPUP DE COMPRA) *******************/
    const users: string[] = [this.userEmail];         // users.push('a@a.com');
    const action: string[] = ['compra', 'venta', 'intercambio'];
    const type: string[] = ['ETH-9643.49'];
    /*******************************************************/

    const dialogRef = this.dialog.open(BuyCriptoComponent, {  // Configuracion para dialog
      data: {users, action, type,}
    });

    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      console.log(result);
      if (result){
        if (result.invalid){
          this.showNotification('danger', 'Campos invalidos', 'top', 'center');              // Muestra notificación de error
        }else{
          this.confirmDialog(result);
        }
      }
      
    });
  }

  confirmDialog(form: FormGroup): void{
    const amount: number = form.get('amount').value;
    const type: string =  form.get('type').value;
    const total: number = amount * 1;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Configuracion para dialog
      data: {
        type,
        amount,
        total
      }
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result){this.doBuy(form); }
    });
  }

  doBuy(form: FormGroup): void{
    this.showLoading();
    const dataSend = {
       amount: form.get('amount').value,
       type:  form.get('type').value,
       email: form.get('user').value,
       description: form.get('description').value,
       action: form.get('action').value
    };
    /**************** AQUI SE MODIFICA (Comprar) *******************/
    this.bbvaService.buyCrypto(dataSend)
      .subscribe((data) => {
        console.log(data);
        this.closeLoading();
        this.showNotification('success', 'Compra correcta', 'top', 'right');
      }, (err: HttpErrorResponse) => {
        this.closeLoading();
        this.showNotification('danger', 'Error', 'top', 'rigth');
      });
    /*******************************************************/

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
