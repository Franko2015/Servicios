import { HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, concatMap, interval, startWith, switchMap } from 'rxjs';
import { Chat, ChatService } from 'src/app/Servicios/chat/chat.service';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';

@Component({
  selector: 'app-nav-chat',
  templateUrl: './nav-chat.component.html',
  styleUrls: ['./nav-chat.component.css']
})
export class NavChatComponent {
  subscription: Subscription
  rut_usuario: any = localStorage.getItem('UserId')
  chatUsuario: any = []

  mensaje: string = ''
  ultimoMensaje: any

  // En tu componente
  ultimaFecha: string = '';

  constructor(private chatService: ChatService, private errorService: ErrorService, private cdr: ChangeDetectorRef, private traductor: TraductorService, private trad: TranslateService, private toastrService: ToastrService) {
    this.subscription = interval(1000)
      .pipe(
        startWith(0),
        concatMap(async () => this.getChat())
      )
      .subscribe();
  }

  ngOnDestroy() {

  }

  // En tu componente
  ngOnInit() {
    this.getChat();
  }


  ngOnChanges() {
  }

  onSubmit() {
    if (!this.validarMensaje()) {
      this.toastrService.error("Favor de ingresar un texto válido");
    } else {
      if (this.mensaje.trim() != '') {
        const chat: Chat = {
          rut_cliente: this.rut_usuario,
          mensaje: this.mensaje
        };

        this.chatService.postChat(chat).subscribe({
          next: (data: any) => {
            this.ngOnInit()
            this.mensaje = ''
          },
          error: (event: HttpErrorResponse) => {
            this.errorService.msjError(event);
          }
        });
      }
    }
  }

  getChat() {
    this.chatService.getChat(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.chatUsuario = data;
        this.ultimaFecha = this.chatUsuario.length > 0 ? this.chatUsuario[this.chatUsuario.length - 1].fecha_envio : '';
        this.scrollToBottom();
        this.cdr.detectChanges();
      },
      error: (event: HttpErrorResponse) => {
        
      }
    });
  }

  validarMensaje(): boolean {
    const palabras = this.mensaje.split(' ');
    return palabras.every(palabra => palabra.length < 10);
  }

  // En tu componente
  trackByFn(index: number, item: any) {
    return item.id; // Asumiendo que cada mensaje tiene un atributo único 'id'
  }

  // Después de actualizar los mensajes
  scrollToBottom() {
    if (this.ultimoMensaje) {
      this.ultimoMensaje.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  groupMessagesByDay() {
    const groupedMessages: { [key: string]: any[] } = {};

    this.chatUsuario.forEach((message: any) => {
      const day = new Date(message.fecha_envio).toLocaleDateString();
      if (!groupedMessages[day]) {
        groupedMessages[day] = [];
      }
      groupedMessages[day].push(message);
    });

    return Object.entries(groupedMessages).map(([key, value]) => ({ fecha: key, mensajes: value }));
  }

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }

}
