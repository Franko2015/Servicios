import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TraductorService } from '../../Servicios/traductor.service';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/Servicios/error/error.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit{

  tipo_cuenta: any;
  rut_usuario: any = localStorage.getItem('UserId')
  usuario: any;
  SOPORTE: boolean = false
  CLIENTE: boolean = false
  TECNICO: boolean = false

  isSidebarCollapsed = false;

  constructor(private traductor: TraductorService, private trad: TranslateService, private router: Router, private usuariosService: UsuariosService, private errorService: ErrorService) {
    
  }

  ngAfterViewInit(){
    this.datosUsuario()
  }

  datosUsuario(){
    this.usuariosService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        if(data.tipo_cuenta == 'SOPORTE'){
          this.SOPORTE = data.tipo_cuenta
        }else if(data.tipo_cuenta == 'TECNICO'){
          this.TECNICO = data.tipo_cuenta
        }else if(data.tipo_cuenta == 'CLIENTE'){
          this.CLIENTE = data.tipo_cuenta
        }
        this.usuario = data.nombre
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    })
  }

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.highlightActiveLink();
      }
    });
  }
  
  highlightActiveLink() {
    const currentRoute = this.router.url;
    const links = document.querySelectorAll('.list-group-item');
  
    links.forEach((link) => {
      const href = link.getAttribute('routerLink');
      if (href === currentRoute) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
