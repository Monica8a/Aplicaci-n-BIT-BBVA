import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DeviceModel } from '../../../../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class AdvanceTableService {
  private readonly API_URL = 'assets/data/devices.json';

  dataChange: BehaviorSubject<DeviceModel[]> = new BehaviorSubject<
    DeviceModel[]
  >([]);

  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): DeviceModel[] {
    return this.dataChange.value;
  }

  getDialogData(): DeviceModel {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAdvanceTables(): void {
    this.httpClient.get<DeviceModel[]>(this.API_URL).subscribe(
      data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  // DEMO ONLY, you can find working methods below
  addAdvanceTable(advanceTable: DeviceModel): void {
    this.dialogData = advanceTable;
  }

  updateAdvanceTable(advanceTable: DeviceModel): void {
    this.dialogData = advanceTable;
  }

  deleteAdvanceTable(id: number): void {
    console.log(id);
  }
}
