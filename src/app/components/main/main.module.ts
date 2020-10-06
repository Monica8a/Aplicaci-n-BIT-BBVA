import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';

import { BlankComponent } from './blank/blank.component';
import { MainRoutingModule } from './main-routing.module';
import { MovementsComponent } from './movements/movements.component';
import { CryptoComponent } from './crypto/crypto.component';
import { TransfersComponent } from './transfers/transfers.component';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [BlankComponent, MovementsComponent, CryptoComponent, TransfersComponent, HomeComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MainRoutingModule
  ]
})
export class MainModule { }
