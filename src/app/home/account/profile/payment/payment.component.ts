import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { interval, startWith, switchMap } from 'rxjs';
import { AuthService } from 'src/app/Servicios/auth/auth.service';
import {
  CarteraService,
  Cuenta,
} from 'src/app/Servicios/cartera/cartera.service';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';
import { ProfileComponent } from '../profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ProfileComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  private subscription: any;

  usuario: any = [];
  datos_pago: any = [];
  rut_usuario: any = localStorage.getItem("UserId")

  monto: number = 3;

  resultado: boolean = false;

  constructor(
    private traductor: TraductorService,
    private trad: TranslateService,
    private carteraService: CarteraService,
    private authService: AuthService,
    private location: Location,
    private usuariosService: UsuariosService,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private router: Router
  ) {

    this.datosCliente();

    if (this.datos_pago) {
      this.resultado = true
    } else {
      this.resultado = false
    }
  }

  onSubmit() {
    if(this.monto <= 3) {
      return
    } else {
    this.carteraService.createPayment(this.rut_usuario, this.monto).subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg);
        window.open(data.URL);
        this.datosTarjetas();
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    });
  }
  }

  datosCliente() {
    this.usuariosService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.usuario = data;

        this.datosTarjetas()
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      }
    });
  }

  datosTarjetas() {
    this.carteraService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.datos_pago = data;
        this.resultado = true;
      },
      error: (event: HttpErrorResponse) => {
        this.resultado = false;
      }
    });
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
