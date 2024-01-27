import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { CarteraService } from 'src/app/Servicios/cartera/cartera.service';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { TicketService } from 'src/app/Servicios/ticket/ticket.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';

@Component({
  selector: 'app-services-tickets',
  templateUrl: './services-tickets.component.html',
  styleUrls: ['./services-tickets.component.css'],
})
export class ServicesTicketsComponent implements OnInit {
  problema: any[] = [];
  nuevoTicket: any = [];

  txtBuscar: string = '';
  listaChecked: any[] = [];

  subtotal: number = 0;

  tickets: any = [];
  id_nuevoTicket: number = 0;

  totalElementos: any[] = [];
  itemsPorPagina = 8;
  paginaActual = 1;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private trad: TranslateService,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private carteraService: CarteraService,
    private traductor: TraductorService
  ) {}

  ngOnInit() {
    this.cargarProblemas();
    this.listaChecked = [];
  }

  agregarCarrito(problema: any) {
    const index = this.listaChecked.findIndex(
      (item) => item.id === problema.id
    );

    if (index === -1) {
      this.listaChecked.push(problema);
      this.calcularSubtotal();
    } else {
      this.listaChecked.splice(index, 1);
      this.calcularSubtotal();
    }
  }

  calcularSubtotal() {
    this.subtotal = 0;

    for (let i = 0; i < this.listaChecked.length; i++) {
      const element = this.listaChecked[i].precio;
      this.subtotal += element;
    }
  }

  isChecked(item: any): boolean {
    return this.listaChecked.some((i) => i.id === item.id);
  }

  pagarCarrito() {
    const rut_usuario = localStorage.getItem('UserId');

    if (!rut_usuario) {
      console.error('Rut de usuario no definido');
      return;
    }

    if (window.confirm('¿Desea realizar el pedido?')) {
      for (let i = 0; i < this.listaChecked.length; i++) {
        const ticket = {
          rut_usuario: rut_usuario,
          descripcion: this.listaChecked[i].problema,
          valor_trabajo: this.listaChecked[i].precio,
          pagado: 'No',
          fecha_creacion: Date.now(),
        };

        this.nuevoTicket.push(ticket);
      }

      this.ticketService.post(this.nuevoTicket).subscribe({
        next: (data: any) => {
          this.toastr.show(data.msg);

          this.router.navigate(['/account/history']);
        },
        error: (event: HttpErrorResponse) => {
          this.errorService.msjError(event); // Asegúrate de que errorService no esté devolviendo undefined
        },
      });
    }
  }

  filtrarProblemas() {
    return this.problema.filter((item) =>
      item.problema.toLowerCase().includes(this.txtBuscar.toLowerCase())
    );
  }

  cargarProblemas() {
    this.problema = [
      { id: 1, problema: 'Problemas de red', precio: 20 },
      { id: 2, problema: 'Instalación de software', precio: 15 },
      { id: 3, problema: 'Problemas con el sistema operativo', precio: 25 },
      { id: 4, problema: 'Configuración de correo electrónico', precio: 10 },
      { id: 5, problema: 'Problemas con el antivirus', precio: 20 },
      { id: 6, problema: 'Recuperación de datos', precio: 30 },
      { id: 7, problema: 'Problemas con el hardware', precio: 35 },
      { id: 8, problema: 'Configuración de impresoras', precio: 15 },
      { id: 9, problema: 'Problemas con software específico', precio: 20 },
      { id: 10, problema: 'Configuración de VPN', precio: 25 },
      { id: 11, problema: 'Optimización de sistema', precio: 20 },
      { id: 12, problema: 'Problemas con el correo electrónico', precio: 10 },
      { id: 13, problema: 'Configuración de cortafuegos', precio: 25 },
      { id: 14, problema: 'Problemas con el acceso remoto', precio: 20 },
      { id: 15, problema: 'Instalación de software de seguridad', precio: 15 },
      { id: 16, problema: 'Configuración de redes inalámbricas', precio: 20 },
      { id: 17, problema: 'Problemas con el sistema de archivos', precio: 30 },
      { id: 18, problema: 'Optimización de recursos', precio: 25 },
      { id: 19, problema: 'Problemas con el sistema de respaldo', precio: 20 },
      { id: 20, problema: 'Configuración de servidores', precio: 35 },
      { id: 21, problema: 'No puedo sincronizar mis dispositivos', precio: 15 },
      { id: 22, problema: 'Necesito ayuda para configurar mi correo en el celular', precio: 12 },
      { id: 23, problema: 'Mi computadora se bloquea constantemente', precio: 18 },
      { id: 24, problema: 'No puedo abrir archivos adjuntos en mi correo', precio: 8 },
      { id: 25, problema: 'Necesito instalar una impresora inalámbrica', precio: 10 },
      { id: 26, problema: 'Mi conexión de videoconferencia no funciona correctamente', precio: 12 },
      { id: 27, problema: 'Tengo problemas para compartir archivos en la red', precio: 13 },
      { id: 28, problema: 'Mi antivirus muestra un error', precio: 15 },
      { id: 29, problema: 'No puedo reproducir un video en mi dispositivo', precio: 12 },
      { id: 30, problema: 'Necesito ayuda para configurar mi red VPN', precio: 15 },
    ];
  }
  

  get itemsPaginaActual() {
    // No se ha realizado una búsqueda, aplicar lógica original
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.filtrarProblemas().slice(inicio, fin);
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
      this.filtrarProblemas().length / this.itemsPorPagina
    );
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
    }
  }

  get totalPaginas() {
    return Math.ceil(this.filtrarProblemas().length / this.itemsPorPagina);
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
