import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree, } from '@angular/router';
import { AccountComponent } from '../home/account/account.component';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../Servicios/auth/auth.service';
import { UsuariosService } from '../Servicios/login/usuarios.service';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token == undefined || token == null) {
    route.component = HomeComponent;
  }
  return true;
};