import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private _url = `${environment.endpoint}/logs`

  constructor(private http: HttpClient) {}

  getAll(): Observable<Logs[]> {
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Logs[]>(`${this._url}`, { headers: header });
  }

}

export interface Logs {
  id_log: number,
  tipo_log: string;
  fecha: Date;
  descripcion: string;
}