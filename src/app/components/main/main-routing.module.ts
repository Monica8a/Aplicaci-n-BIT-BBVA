import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankComponent } from './blank/blank.component';
import { HomeComponent } from './home/home.component';
import { MovementsComponent } from './movements/movements.component';
import { CryptoComponent } from './crypto/crypto.component';
import { TransfersComponent } from './transfers/transfers.component';


const routes: Routes = [
  { path: 'blank', component: BlankComponent },
  { path: 'home', component: HomeComponent },
  { path: 'movements', component: MovementsComponent },
  { path: 'crypto', component: CryptoComponent },
  { path: 'transfers', component: TransfersComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
