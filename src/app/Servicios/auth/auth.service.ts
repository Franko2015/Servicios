import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url = `${environment.endpoint}/login`

  private header = new HttpHeaders({ 'Content-Type': 'application/json' });

  rut_usuario: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  login(usuario: UserLogin): Observable<any> {
    return this.http.post(this._url, {usuario: usuario.usuario, contrasena: usuario.contrasena}, { headers: this.header });
  }

  logout() {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.clear();
      this.router.navigate(['/home']);
    }
  }

  sendRecoveryEmail(email: string): Observable<any> {
    return this.http.post(`${environment.endpoint}/recover`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<ResetResponse> {
    const body = {
      token: token,
      newPassword: newPassword
    };

    return this.http.post<ResetResponse>(`${environment.endpoint}/reset/`, body, { headers: this.header });
  }

}

interface ResetResponse {
  msg: string;
}

export interface UserLogin {
  usuario: string;
  contrasena: string;
}
