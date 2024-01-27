import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  private _url = `${environment.endpoint}/usuarios`;

  private header = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this._url}`, { headers: this.header });
  }

  getOne(rut: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this._url}` + '/' + rut, { headers: this.header });
  }

  create(usuario: Usuario) {
    return this.http.post(`${this._url}`, usuario, { headers: this.header });
  }

  state(id: string, estado_cuenta: string) {
    let usuario = {
      estado_cuenta: estado_cuenta,
    };
    return this.http.put(`${this._url}/state/${id}`, usuario, { headers: this.header });
  }

  edit(usuario: Usuario) {
    return this.http.put(`${this._url}/${usuario.rut_usuario}`, usuario, { headers: this.header });
  }
}

export interface Usuario {
  rut_usuario: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  usuario: string;
  contrasena: string;
  nacionalidad: string;
  estado_cuenta: string;
  tipo_cuenta: string;
}
