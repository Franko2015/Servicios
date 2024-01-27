import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Asignacion, AsignacionService } from 'src/app/Servicios/asignacion/asignacion.service';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { TicketService } from 'src/app/Servicios/ticket/ticket.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements AfterViewInit {

  datos: any = []
  usuario: any = []

  rut_usuario: any = localStorage.getItem("UserId")

  totalElementos: any[] = [];
  itemsPorPagina = 5;
  paginaActual = 1;

  SOPORTE: boolean = false
  CLIENTE: boolean = false
  TECNICO: boolean = false

  constructor(private toastr: ToastrService, private traductor: TraductorService, private trad: TranslateService, private ticketsService: TicketService, private usuariosService: UsuariosService, private errorService: ErrorService, private asignacionService: AsignacionService){

  }

  ngAfterViewInit() {
    this.cargarHistorial();
    this.datosUsuario();
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

  cargarHistorial() {
    this.ticketsService.getAll().subscribe({
      next: (data: any) => {
        // Se ordenan los tickets del más reciente al actual
        this.datos = data.sort((a: any, b: any) => b.id_detalle - a.id_detalle).filter((a: any) => a.pagado == 'Si');
        this.totalElementos = this.datos.length;
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    });
  }

  asignar(item: any){
    let asignacion: Asignacion = {
      id_detalle: item.id_ticket,
      rut_tecnico: this.rut_usuario
    }
    this.asignacionService.post(asignacion).subscribe({
      next: (data: any) => {
        this.cargarHistorial(); 
        this.toastr.show(data.msg)
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }


  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }


  get itemsPaginaActual() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.datos.slice(inicio, fin);
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
      this.datos.length / this.itemsPorPagina
    );
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
    }
  }

  get totalPaginas() {
    return Math.ceil(this.datos.length / this.itemsPorPagina);
  }

  get paginas() {
    const inicio = Math.max(1, this.paginaActual - 2);
    const fin = Math.min(inicio + 4, this.totalPaginas);
    return Array(fin - inicio + 1)
      .fill(0)
      .map((_, index) => inicio + index);
  }
}

