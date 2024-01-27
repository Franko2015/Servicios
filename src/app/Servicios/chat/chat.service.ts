import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private newMessageSource = new Subject<void>();
  newMessage$ = this.newMessageSource.asObservable();

  private _url = `${environment.endpoint}/chat`

  private header = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllChats(): Observable<Chat[]>{
    return this.http.get<Chat[]>(`${this._url}`, { headers: this.header });
  }

  getChat(rut_usuario: string): Observable<Chat[]>{
    return this.http.get<Chat[]>(`${this._url}/${rut_usuario}`, { headers: this.header });
  }

  postChat(chat: Chat): Observable<Chat[]> {
    return this.http.post<Chat[]>(`${this._url}`, chat, { headers: this.header });
  }

  postChatSistema(chat: ChatSistema) {
    return this.http.post(`${this._url}`, chat, { headers: this.header });
  }

  leido(rut_usuario: string) {
    return this.http.put(`${this._url}/read/${rut_usuario}`, { headers: this.header });
  }
  
  notifyNewMessage() {
    this.newMessageSource.next();
  }

}

export interface ChatSistema {
  rut_usuario: string;
  rut_cliente: string;
  mensaje: string;
}


export interface Chat {
  rut_cliente: string;
  mensaje: string;
}
