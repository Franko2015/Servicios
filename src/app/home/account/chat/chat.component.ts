import { Component, OnChanges, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { Chat, ChatService, ChatSistema } from 'src/app/Servicios/chat/chat.service';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../../Servicios/login/usuarios.service';
import { Router } from '@angular/router';
import { TraductorService } from '../../../Servicios/traductor.service';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  private chatSubscription: any;

  rut_usuario: any = localStorage.getItem('UserId')

  rut_cliente: any = localStorage.getItem("rut_cliente_chat")
  chatUsuario: any = []

  mensaje: string = ''
  ultimoMensaje: any
  ultimaFecha: string = '';

  usuario: any;
  clientes: any = []

  totalElementos: any[] = [];
  itemsPorPagina = 8;
  paginaActual = 1;

  constructor(private usuarioService: UsuariosService, private chatService: ChatService, private errorService: ErrorService, private cdr: ChangeDetectorRef, private traductor: TraductorService, private trad: TranslateService, private router: Router) { }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.datosUsuario(); // Llamas a la función para obtener datos de usuario
    this.chatSubscription = this.chatService.getAllChats().subscribe({
      next: (data: any) => {
        this.chatUsuario = data.filter((usuario: any) => usuario.tipo_cuenta === 'CLIENTE');
        this.ultimaFecha = this.chatUsuario.length > 0 ? this.chatUsuario[this.chatUsuario.length - 1].fecha_envio : '';
        this.clientes = this.groupMessagesByUser();
        this.cdr.detectChanges();
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    });
    this.chat(this.rut_cliente)
  }

  onSubmit() {
    if (this.mensaje.trim() !== '') {

      const chat: ChatSistema = {
        rut_cliente: this.rut_cliente,
        rut_usuario: this.rut_usuario,
        mensaje: this.mensaje
      };

      this.chatService.postChatSistema(chat).subscribe({
        next: () => {
          this.mensaje = '';
          this.chatService.leido(this.rut_cliente).subscribe({
            next: () => {
              this.ngOnInit()
            },
            error: (event: HttpErrorResponse) => {
              this.errorService.msjError(event);
            }
          });
        },
        error: (event: HttpErrorResponse) => {
          this.errorService.msjError(event);
        }
      });
    }
  }

  datosUsuario() {
    this.usuarioService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    });
  }

  chat(rutCliente: string) {
    localStorage.setItem("rut_cliente_chat", rutCliente)
    this.rut_cliente = localStorage.getItem("rut_cliente_chat")
    this.chatService.getChat(this.rut_cliente).subscribe({
      next: (data: any) => {
        this.chatUsuario = data
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    })
  }


  groupMessagesByUser() {
    const lastMessages: { [key: string]: any } = {};

    this.chatUsuario.forEach((message: any) => {
      const userKey = message.rut_cliente;
      if (!lastMessages[userKey] || message.fecha_envio > lastMessages[userKey].fecha_envio) {
        lastMessages[userKey] = message;
      }
    });

    return Object.values(lastMessages);
  }

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }

  get itemsPaginaActual() {
    // No se ha realizado una búsqueda, aplicar lógica original
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.clientes.slice(inicio, fin);

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
      this.clientes.length / this.itemsPorPagina
    );
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
    }
  }

  get totalPaginas() {
    return Math.ceil(this.clientes.length / this.itemsPorPagina);
  }

  get paginas() {
    const inicio = Math.max(1, this.paginaActual - 2);
    const fin = Math.min(inicio + 4, this.totalPaginas);
    return Array(fin - inicio + 1)
      .fill(0)
      .map((_, index) => inicio + index);
  }

}
