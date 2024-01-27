import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TraductorService } from '../../../Servicios/traductor.service';
import { TranslateService } from '@ngx-translate/core';
import { TicketService } from 'src/app/Servicios/ticket/ticket.service';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CarteraService } from 'src/app/Servicios/cartera/cartera.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { TecnicoService } from 'src/app/Servicios/tecnico/tecnico.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements AfterViewInit {
  datos: any = [];
  usuario: any = []

  datos_pago: any;
  rut_usuario: any = localStorage.getItem('UserId');
  dineroDisponible: number = 0;

  totalElementos: any[] = [];
  itemsPorPagina = 5;
  paginaActual = 1;

  constructor(
    private usuarioService: UsuariosService,
    private toastr: ToastrService,
    private traductor: TraductorService,
    private trad: TranslateService,
    private ticketsService: TicketService,
    private errorService: ErrorService,
    private carteraService: CarteraService,
    private usuariosService: UsuariosService,
    private tecnicoService: TecnicoService,
  ) {
    this.rut_usuario = localStorage.getItem('UserId');
  }

  ngAfterViewInit() {
    this.cargarHistorial();
    this.cargarTarjeta();
  }

  cargarTarjeta() {
    this.carteraService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.datos_pago = data;
        this.dineroDisponible = this.datos_pago.monto;
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    });
  }

  cargarHistorial() {
    this.ticketsService.getTickets(this.rut_usuario).subscribe({
      next: (data: any) => {
        // Se ordenan los tickets del más reciente al actual
        this.datos = data.sort((a: any, b: any) => b.id_detalle - a.id_detalle);
        this.totalElementos = this.datos.length;
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    });
  }

  datosUsuario() {
    this.usuariosService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    });
  }

  pagar(item: any) {
    if (this.datos_pago.monto >= item.valor_trabajo) {
      this.carteraService.payTicket(this.rut_usuario, item.valor_trabajo, item.id_ticket).subscribe({
        next: (data: any) => {
          this.toastr.show(data.msg);
          this.ngAfterViewInit()
        },
        error: (event: HttpErrorResponse) => {
          this.errorService.msjError(event); // Asegúrate de que errorService no esté devolviendo undefined
        },
      })
    } else {
      this.toastr.warning('Saldo insuficiente');
    }
  }

  asignar(item: any){
    this.tecnicoService.assigment(item.id_ticket, this.rut_usuario).subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg)
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event); // Asegúrate de que errorService no esté devolviendo undefined
      },
    })

    
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
    const totalPaginas = Math.ceil(this.datos.length / this.itemsPorPagina);
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
  
  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }
}
