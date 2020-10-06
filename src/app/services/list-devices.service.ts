import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { DeviceModel } from '../models/device.model';
import { environment } from '../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class ListDevicesService {
  piUri = 'http://localhost:3000';
  private readonly API_URL = 'assets/data/advanceTable.json';
  private apiUri: string;                        // String para hacer url completa
  dialogData: DeviceModel;
  dataChange: BehaviorSubject<DeviceModel[]> = new BehaviorSubject<DeviceModel[]>([]);

  constructor(private http: HttpClient){
    // this.apiUri = `${this.url}:${this.port}/${this.apiPath}`;   // Crea URL
  }

  /** CRUD METHODS */
  getDevices(): any {
   return this.http.get(this.API_URL)
    // return this.http.get(`${ this.apiUri }/devices/user/getAll/`, {headers: this.getHeaders()})
    .pipe( catchError(err => of([])) );
  }

  get data(): DeviceModel[] {
    return this.dataChange.value;
  }

  setNewValue(data: DeviceModel[]): void{
    this.dataChange.next(data);
  }


}
