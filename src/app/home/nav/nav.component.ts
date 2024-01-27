import { AfterViewInit, Component, OnChanges, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TraductorService } from '../../Servicios/traductor.service';
import { AuthService } from 'src/app/Servicios/auth/auth.service';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { ErrorService } from '../../Servicios/error/error.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var google: any

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [AuthService, UsuariosService]
})
export class NavComponent {

  storedLanguage = localStorage.getItem('selectedLanguage')
  rut_usuario = localStorage.getItem('UserId')
  bandera = '';
  datos: any;
  nombre: string = '';
  tipo: string = '';
  isLogged: any;

  constructor(private traductor: TraductorService, private authService: AuthService, private router: Router, private trad: TranslateService, private usuariosService: UsuariosService, private errorService: ErrorService) {

    this.lenguajePrincipal();

    const token = localStorage.getItem('token');

    if (token) {
      this.isLogged = true;
      this.getUsuario()
    } else {
      this.isLogged = false;
    }
  }


  getUsuario(){
    if (this.rut_usuario != undefined) {
      this.usuariosService.getOne(this.rut_usuario!).subscribe({
        next: (data: any) => {
          this.datos = data;
          this.nombre = data.nombre;
          this.tipo = data.tipo_cuenta;
        },
        error: (event: HttpErrorResponse) => {
          this.errorService.msjError(event);
        }
      })
    }
  }




  lenguajePrincipal() {

    this.trad.addLangs(['en', 'es'])

    const lang = this.trad.getBrowserLang()

    if (lang !== 'es' && lang !== 'en') {

      this.trad.setDefaultLang('en');
      this.bandera = 'flag-icon flag-icon-us flag'

    } else {

      this.trad.setDefaultLang(lang);
      this.switchLang(lang)

    }
  }

  switchLang(lang: string) {
    this.changeLanguage(lang);
    this.storedLanguage = lang;
    this.changeFlag(this.storedLanguage)
  }


  changeFlag(bandera: string) {
    switch (bandera) {
      case "es":
        this.bandera = "flag-icon flag-icon-es flag"
        break;
      case "en":
        this.bandera = "flag-icon flag-icon-us flag"
        break;
      case "pl":
        this.bandera = "flag-icon flag-icon-pl flag"
        break;
      case "de":
        this.bandera = "flag-icon flag-icon-de flag"
        break;
      case "zh":
        this.bandera = "flag-icon flag-icon-cn flag"
        break;
      case "ja":
        this.bandera = "flag-icon flag-icon-jp flag"
        break;
      case "fr":
        this.bandera = "flag-icon flag-icon-fr flag"
        break;
      case "pt":
        this.bandera = "flag-icon flag-icon-pt flag"
        break;
      case "ru":
        this.bandera = "flag-icon flag-icon-rs flag"
        break;
    }
  }

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }

  logOut() {
    this.authService.logout()
  }


  // En tu componente
  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

}
