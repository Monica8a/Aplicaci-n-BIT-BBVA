import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faQuestionCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  icon: IconDefinition;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,    // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,             // Agrega datos de dialog
  ) { 
    this.icon = faQuestionCircle;
  }

  ngOnInit(): void{
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
