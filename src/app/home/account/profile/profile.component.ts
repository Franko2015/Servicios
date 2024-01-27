import { CarteraService } from './../../../Servicios/cartera/cartera.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TraductorService } from '../../../Servicios/traductor.service';
import { TranslateService } from '@ngx-translate/core';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { AuthService } from 'src/app/Servicios/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { PersonalComponent } from './personal/personal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PersonalComponent, PaymentComponent, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario: any;
  tarjeta: any;

  resultado: boolean = false;

  rut_usuario: any = localStorage.getItem("UserId")

  constructor(private traductor: TraductorService, private trad: TranslateService, private carteraService: CarteraService, private authService: AuthService, private usuariosService: UsuariosService, private toastr: ToastrService, private errorService: ErrorService) {
    if (this.authService.rut_usuario != undefined) {

    }

  }

  ngOnInit(): void {
    this.datosUsuario();
    this.datosTarjetas();
  }

  datosUsuario() {
    this.usuariosService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.usuario = data;
      }
    });
  }

  datosTarjetas() {
    this.carteraService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.tarjeta = data;
        this.resultado = true;
      },
      error: (error: HttpErrorResponse) => {
        this.resultado = false;
      }
    });
  }
  

  verificarDatos() {
    this.resultado = !this.tarjeta || this.tarjeta.length === 0;
  }
  

  deleteAccount() {
    window.confirm("¿Está seguro de eliminar su cuenta?")
  }

  preventCopy(event: Event) {
    event.preventDefault();
  }

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }

}
