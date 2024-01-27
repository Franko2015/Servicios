import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {

  private _url = `${environment.endpoint}/cartera`
  // private _url = `http://52.20.204.127:4000/api/cartera`

  private header = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getOne(rut_usuario: string): Observable<any> {
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this._url}/${rut_usuario}`, { headers: header })
      .pipe(catchError(this.handleError));
  }

  edit(rut_usuario: string, monto: number): Observable<any> {
    return this.http.put(`${this._url}/${rut_usuario}`, monto, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  del(id_cuenta: string): Observable<any> {
    return this.http.delete(`${this._url}/${id_cuenta}`, { headers: this.header })
      .pipe(catchError(this.handleError));
  }  

  create(cuenta: Cuenta): Observable<any> {
    return this.http.post(this._url, cuenta, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  addCash(rut_usuario: string, monto: number, id_ticket: number): Observable<any>{
    return this.http.post(`${this._url}/payment`, { rut_usuario, monto, id_ticket }, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  payTicket(rut_usuario: string, monto: number, id_ticket: number): Observable<any> {
    const payment = { rut_usuario: rut_usuario, monto: monto, id_ticket: id_ticket };
    return this.http.post(`${this._url}/pay-ticket`, payment, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  createPayment(rut_usuario: string, monto: number): Observable<any> {
    return this.http.post(`${this._url}/create-payment`, { rut_usuario: rut_usuario, monto_a_agregar: monto }, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  executePayment(): Observable<any> {
    return this.http.post(`${this._url}/execute-payment`, { headers: this.header })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error en la petición HTTP:', error);
    return throwError(error);
  }
}

export interface Cuenta {
  rut_usuario: string;
  monto: number;
}
