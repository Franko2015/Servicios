import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  private _url = `${environment.endpoint}/tecnico`

  private header = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this._url, { headers: this.header });
  }

  getOne(id: string) {
    return this.http.get(`${this._url}/${id}`, { headers: this.header });
  }

  create(rut_usuario: string) {
    const usuario = {
      rut_usuario: rut_usuario
    }
    return this.http.post(this._url, usuario, { headers: this.header });
  }
  

  edit(tecnico: Tecnico) {
    return this.http.put(`${this._url}/${tecnico.rut_usuario}`, tecnico, { headers: this.header });
  }

  post(tecnico: Tecnico) {
    return this.http.post(`${this._url}/add`, tecnico, { headers: this.header });
  }

  del(rut: string, habilidad: string) {
    const tecnico = {
      habilidad: habilidad
    }
    return this.http.delete(`${this._url}/${rut}` , { headers: this.header });
  }

  assigment(ticket: number, rut_tecnico: string){
    const asignacion = {
      ticket: ticket,
      rut_tecnico: rut_tecnico
    }
    return this.http.post(`${this._url}`, asignacion , { headers: this.header });
  }
}

export interface Tecnico {
  rut_usuario: string;
  habilidad: string;
  descripcion_habilidad: string;
  puntuacion_habilidad: number;
}
