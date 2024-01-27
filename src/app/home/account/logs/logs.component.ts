import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { LogService } from 'src/app/Servicios/log/log.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  datos: any

  txtBuscarPeticion: string = '';

  totalElementos: any[] = [];
  itemsPorPagina = 8;
  paginaActual = 1;

  constructor(private logService: LogService, private errorService: ErrorService, private toastr: ToastrService, private traductor: TraductorService, private trad: TranslateService) {

  }

  ngOnInit() {
    this.logService.getAll().subscribe({
      next: (data: any) => {
        this.datos = data
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event); // Asegúrate de que errorService no esté devolviendo undefined
      },
    });
  }


  filtrarLogs() {
    if (this.txtBuscarPeticion) {
      return this.datos.filter((item: any) =>
      item.tipo_log.toLowerCase().includes(this.txtBuscarPeticion.toLowerCase()));
    }
    return this.datos.filter((item: any) =>
    item.tipo_log.toLowerCase().includes(this.txtBuscarPeticion.toLowerCase()));
  }


  get itemsPaginaActual() {
    // No se ha realizado una búsqueda, aplicar lógica original
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.filtrarLogs().slice(inicio, fin);

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
      this.filtrarLogs().length / this.itemsPorPagina
    );
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
    }
  }

  get totalPaginas() {
    return Math.ceil(this.filtrarLogs().length / this.itemsPorPagina);
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
