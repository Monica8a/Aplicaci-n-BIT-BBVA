import { Component, OnInit, Inject } from '@angular/core';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovementModel } from 'src/app/models/movement.model';


@Component({
  selector: 'app-buy-cripto',
  templateUrl: './buy-cripto.component.html',
  styleUrls: ['./buy-cripto.component.scss']
})
export class BuyCriptoComponent implements OnInit {
  faEuroSign = faEuroSign;
  action: string;                     // Acción de editar o agregar
  dialogTitle: string;                // Titulo del dialog
  advanceTableForm: FormGroup;        // Formulario de datos
  advanceTable: MovementModel;         // Modelo de datos
  userEmail: string;

  constructor(
    public dialogRef: MatDialogRef<BuyCriptoComponent>,    // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,             // Agrega datos de dialog
    // public advanceTableService: AdvanceTableService,    // Agrega servicio de tabla
    private fb: FormBuilder                                // Agrega creador de formularios reactivos
  ) {
    this.userEmail = localStorage.getItem('email');
    this.advanceTableForm = this.createContactForm();  // Crea formulario
  }

  ngOnInit(): void {
  }

  /************************** Validadores *************************/
  get aliasValidator(): any {                   // Validador de alias
    return this.advanceTableForm.get('alias');
  }

  get serialValidator(): any {                  // Validador de numero de serie
    return this.advanceTableForm.get('serial');
  }
  /****************************************************************/

  /************************** Métodos *************************/
  createContactForm(): FormGroup {                  // Crea formulario reactivo
    return this.fb.group({
      user: [this.userEmail, [Validators.required]],
      action: ['' , [Validators.required]],
      type: ['', [Validators.required]],
      description: ['' ],
      amount: [1, [Validators.required, Validators.min(1)]]
    });
  }

  submit(): void {         // Funcion para cuando se da 
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
