import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { Tecnico, TecnicoService } from 'src/app/Servicios/tecnico/tecnico.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';

@Component({
  selector: 'app-technical',
  templateUrl: './technical.component.html',
  styleUrls: ['./technical.component.css']
})
export class TechnicalComponent implements AfterViewInit {
  tecnicos: any[] = [];
  rut_tecnico = ''
  usuarios: any[] = [];

  selectedUser: string = "";
  selectedTecnico: string = "";

  txtBuscarRut: string = '';
  txtBuscarNombre: string = '';
  txtBuscarUsuario: string = '';

  txtHabilidad: string = '';
  txtDescripcionHabilidad: string = '';
  txtPuntuacion: number = 0.0;

  totalElementos: any[] = [];
  itemsPorPagina = 8;
  paginaActual = 1;

  constructor(
    private usuariosService: UsuariosService,
    private tecnicoService: TecnicoService,
    private toastr: ToastrService,
    private trad: TranslateService,
    private traductor: TraductorService,
    private errorService: ErrorService) {
  }

  ngAfterViewInit() {
    this.cargarTecnicos()
    this.cargarUsuarios()
  }

  cargarTecnicos() {
    this.tecnicoService.getAll().subscribe({
      next: (data: any) => {
        this.tecnicos = data
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  cargarUsuarios() {
    this.usuariosService.getAll().subscribe({
      next: (data: any) => {
        this.usuarios = data
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  onSubmit() {
    const tecnico: Tecnico = {
      rut_usuario: this.rut_tecnico,
      habilidad: this.txtHabilidad,
      descripcion_habilidad: this.txtDescripcionHabilidad,
      puntuacion_habilidad: this.txtPuntuacion
    }
    this.tecnicoService.post(tecnico).subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg)
        this.ngAfterViewInit()
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  addTecnico() {
    this.tecnicoService.create(this.selectedUser).subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg)
        this.ngAfterViewInit()
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  eliminarHabilidad(rut_usuario: string, habilidad: string) {
    this.tecnicoService.del(rut_usuario, habilidad).subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg)
        this.ngAfterViewInit()
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  nuevaHabilidad() {
    const habilidad = {
      rut_usuario: this.selectedTecnico,
      habilidad: this.txtHabilidad,
      descripcion_habilidad: this.txtDescripcionHabilidad,
      puntuacion_habilidad: Number(this.txtPuntuacion)
    }
    if(this.txtPuntuacion > 10.0 || this.txtPuntuacion < 0.0) {
      return
    }
    this.tecnicoService.post(habilidad).subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg)
        this.ngAfterViewInit()
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }

  filtrarUsuario() {
    if (this.txtBuscarRut) {
      return this.tecnicos.filter((item) =>
        item.rut_usuario.toLowerCase().includes(this.txtBuscarRut.toLowerCase())
      );
    } else if (this.txtBuscarNombre) {
      return this.tecnicos.filter((nombre) =>
        nombre.nombre.toLowerCase().includes(this.txtBuscarNombre.toLowerCase())
      );
    }
    return this.tecnicos.filter((nombre) =>
      nombre.nombre.toLowerCase().includes(this.txtBuscarNombre.toLowerCase())
    );
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
