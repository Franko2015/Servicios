import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketService {

  private _url = `${environment.endpoint}/ticket`

  private header = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAll() {
    return this.http.get(this._url, { headers: this.header });
  }

  getOne(id: number) {
    return this.http.get(`${this._url}/${id}`, { headers: this.header });
  }

  getTickets(rut_usuario: string){
    return this.http.get(`${this._url}s/${rut_usuario}`, { headers: this.header });
  }

  del(id: number) {
    return this.http.delete(this._url + '/' + id, { headers: this.header });
  }

  post(ticket: Ticket) {
    return this.http.post(this._url, ticket, { headers: this.header });
  }

}

interface Ticket {
  id_ticket: number;
  rut_usuario: string;
  descripcion: string;
  valor_trabajo: number;
  pagado: "No" | "Si";
}

