import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from '../../../app/app-routing.module';

import { AngularMaterialModule } from '../../angular-material.module';
import { EnlaceComponent } from './enlace/enlace.component';


@NgModule({
  declarations: [PageLoaderComponent, NavbarComponent, EnlaceComponent],
  exports: [PageLoaderComponent, NavbarComponent, EnlaceComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    NgxSpinnerModule,
    AppRoutingModule
  ]
})
export class LayoutModule { }
