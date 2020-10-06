import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { MovementModel } from 'src/app/models/movement.model';
import { ListDevicesService } from '../../../services/list-devices.service';
import { LoadingDialogComponent } from '../../shared/dialogs/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss']
})
export class MovementsComponent implements OnInit {

   // Elementos a visualizar en tabla
   displayedColumns = [
    'operation', 'type', 'date', 'cost', 'costBuy', 'description'
  ];

  exampleDatabase: ListDevicesService | null;            // Servicio para obtener datos de tabla
  dataSource: ExampleDataSource | null;                   // Clase para manejo de tabla
  selection = new SelectionModel<MovementModel>(true, []); // Arreglo para multiple selección
  id: number;                                             // Id de cada uno de los elementos
  advanceTable: MovementModel | null;                      // Modelo de datos de la tabla
  isLoading: boolean;                                     // Flag para spinner de cargando

  constructor(
    public router: Router,
    public httpClient: HttpClient,                        // HTTP para servicio
    public dialog: MatDialog,                             // Para uso de Dialogs
    public listDevicesService: ListDevicesService,      // Servicio para tabla
    private snackBar: MatSnackBar,                         // Alertas en forma de snackbar,
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;  // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort: MatSort;                 // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter: ElementRef;           // Obtiene referencia del buscador

  contextMenuPosition = { x: '0px', y: '0px' };                        // Establece posicion de menú de contexto

  ngOnInit(): void {
    this.loadData();      // Craga datos iniciales al cargar página
  }

  refresh(): void {       // Recarga datos de tabla
    this.loadData();
  }

  public loadData(): void {             // Carga la tabla nuevamente
    this.isLoading = false;
    this.exampleDatabase = new ListDevicesService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    // fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
    //   if (!this.dataSource) {
    //     return;
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value;
    // });
  }
}



export class ExampleDataSource extends DataSource<MovementModel> {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  filterChange$ = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange$.value;
  }
  set filter(filter: string) {
    this.filterChange$.next(filter);
  }
  filteredData: MovementModel[] = [];
  renderedData: MovementModel[] = [];
  constructor(
    public dataSource$: ListDevicesService,
    public paginator: MatPaginator,
    public sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange$.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<MovementModel[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.dataSource$.dataChange,
      this.sort.sortChange,
      this.filterChange$,
      this.paginator.page
    ];
    this.loadingSubject.next(true);

    /************************    Aqui se gestiona datos de tabla  **************/
    this.dataSource$.getDevices().subscribe(
      (data: any[]) => {
        this.loadingSubject.next(false);
        // TODO:  Probablemente aqui tengamos que hacer cambio de datos.
        // data.forEach( val => {
        //   console.log(val.date);
        //   val.date = new Date (val.date);
        // });
        this.dataSource$.setNewValue(data);
      },
      (error: HttpErrorResponse) => {
        this.loadingSubject.next(false);
        console.log(error.name + ' ' + error.message);
      }
    );
    /******************************************************************************/

    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.dataSource$.data
          .slice()
          .filter((advanceTable: MovementModel) => {
            const searchStr = (
              advanceTable.operation +
              advanceTable.type +
              advanceTable.date +
              advanceTable.cost +
              advanceTable.costBuy +
              advanceTable.description
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect(): void {
    this.loadingSubject.complete();
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: MovementModel[]): MovementModel[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this.sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'operation':
          [propertyA, propertyB] = [a.operation, b.operation];
          break;
        case 'type':
          [propertyA, propertyB] = [a.type, b.type];
          break;
        case 'date':
          [propertyA, propertyB] = [a.date.valueOf(), b.date.valueOf()];
          break;
        case 'cost':
          [propertyA, propertyB] = [a.cost, b.cost];
          break;
        case 'costBuy':
          [propertyA, propertyB] = [a.costBuy, b.costBuy];
          break;
        case 'description':
          [propertyA, propertyB] = [a.description, b.description];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1)
      );
    });
  }

}
