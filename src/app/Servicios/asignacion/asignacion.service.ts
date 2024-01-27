import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  private _url = `${environment.endpoint}/asignacion`
  //private _url = `http://52.20.204.127:4000/api/asignacion`

  private header = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this._url, { headers: this.header });
  }

  getOne(id: Number) {
    return this.http.get(`${this._url}/${id}`, { headers: this.header });
  }

  del(id: Number) {
    return this.http.delete(`${this._url}/${id}`, { headers: this.header });
  }

  put(asignacion: Asignacion){
    return this.http.put(`${this._url}/${asignacion.id_detalle}`, asignacion.rut_tecnico, { headers: this.header });
  }

  post(asignacion: Asignacion) {
    return this.http.post(this._url, asignacion, { headers: this.header });
  }
}

export interface Asignacion {
  id_detalle: number;
  rut_tecnico: string;
}