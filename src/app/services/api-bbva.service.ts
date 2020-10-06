import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, of, timer, throwError } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiBbvaService {

  apiUri = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(email: string , password: string): Observable<any>{
    return of([]);
   // return this.http.post(`${this.apiUri}/users/login`, {email, password} , {headers: this.getHeaders()});
  }

  register(email: string , name: string, lastN: string, password: string): Observable<any>{
    return of([]);
   // return this.http.post(`${this.apiUri}/users/login`, {email, password} , {headers: this.getHeaders()});
  }

  buyCrypto(data: any): Observable<any>{
    const {amount, type, email, description, action } = data;
    console.log(data);
    return of([]);
    // return this.http.post(`${this.apiUri}/users/login`, {email, password} , {headers: this.getHeaders()});
  }

  costCrypto(): Observable<any>{
    // return throwError('hola');
     return of([]);
  // return this.http.get(`${this.apiUri}/devices/status/${serial}`, {headers: this.getHeaders()});
  }
}
