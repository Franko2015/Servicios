import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  usuarios: any[] = [];

  txtBuscarRut: string = '';
  txtBuscarNombre: string = '';
  txtBuscarUsuario: string = '';

  totalElementos: any[] = [];
  itemsPorPagina = 8;
  paginaActual = 1;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private trad: TranslateService,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private traductor: TraductorService,
  ) { }

  ngOnInit() {
    this.usuariosService.getAll().subscribe({
      next: (data: any) => {
        this.usuarios = data
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  filtrarUsuario() {
    if (this.txtBuscarRut) {
      return this.usuarios.filter((item) =>
        item.rut_usuario.toLowerCase().includes(this.txtBuscarRut.toLowerCase())
      );
    } else if (this.txtBuscarNombre) {
      return this.usuarios.filter((nombre) =>
        nombre.nombre.toLowerCase().includes(this.txtBuscarNombre.toLowerCase())
      );
    } else if (this.txtBuscarUsuario){
      return this.usuarios.filter((usuario) =>
      usuario.usuario.toLowerCase().includes(this.txtBuscarUsuario.toLowerCase())
    );
    }
    return this.usuarios.filter((nombre) =>
      nombre.nombre.toLowerCase().includes(this.txtBuscarNombre.toLowerCase())
    );
  }

  suspender(item: any) {
    this.usuariosService.state(item.rut_usuario, "SUSPENDIDA").subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg)
        this.ngOnInit()
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  activar(item: any) {
    this.usuariosService.state(item.rut_usuario, "ACTIVA").subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg)
        this.ngOnInit()
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  get itemsPaginaActual() {
    // No se ha realizado una búsqueda, aplicar lógica original
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.filtrarUsuario().slice(inicio, fin);

  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    const totalPaginas = Math.ceil(
      this.filtrarUsuario().length / this.itemsPorPagina
    );
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
    }
  }

  get totalPaginas() {
    return Math.ceil(this.filtrarUsuario().length / this.itemsPorPagina);
  }

  get paginas() {
    const inicio = Math.max(1, this.paginaActual - 2);
    const fin = Math.min(inicio + 4, this.totalPaginas);
    return Array(fin - inicio + 1)
      .fill(0)
      .map((_, index) => inicio + index);
  }

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }
}
