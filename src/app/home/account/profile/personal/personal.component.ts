import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth/auth.service';
import {
  UsuariosService,
  Usuario,
} from 'src/app/Servicios/login/usuarios.service';
import { PaisesService } from 'src/app/Servicios/otros/paises.service';
import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/Servicios/error/error.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from '../profile.component';
import { TraductorService } from 'src/app/Servicios/traductor.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ReactiveFormsModule, ProfileComponent, FormsModule, CommonModule],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  correo: string = '';
  nacionalidad: string = '';
  rut_usuario:any = localStorage.getItem("UserId")
  usuarioNuevo: string = '';

  usuario: any;
  paises: any = [];

  constructor(
    private authService: AuthService,
    private paisesService: PaisesService,
    private usuarioService: UsuariosService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private traductor: TraductorService, 
    private trad: TranslateService
  ) {
    this.datosPaises();
    this.datosUsuario();
  }

  onSubmit() {
    
    if (this.correo.trim() === '') {
      this.correo = this.usuario.correo;
    }

    if (this.usuarioNuevo.trim() === '') {
      this.usuarioNuevo = this.usuario.usuario;
    }

    let usuario: Usuario = {
      rut_usuario: this.usuario.rut_usuario,
      nombre: this.usuario.nombre,
      contrasena: this.usuario.contrasena,
      apellido_paterno: this.usuario.apellido_paterno,
      apellido_materno: this.usuario.apellido_materno,
      usuario: this.usuarioNuevo,
      correo: this.correo,
      nacionalidad: this.nacionalidad,
      tipo_cuenta: this.usuario.tipo_cuenta,
      estado_cuenta: this.usuario.estado_cuenta,
    };
    this.usuarioService.edit(usuario).subscribe({
      next: (data: any) => {
        this.toastr.show(data.msg);
        window.location.reload();
      },
      error: (event: HttpErrorResponse) => {
        this.toastr.error(event.error.msg);
      },
    });
  }

  ngOnInit() {}

  datosPaises() {
    this.paisesService.getPaises().subscribe({
      next: (data: any) => {
        this.paises = data;
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    });
  }

  datosUsuario() {
    this.usuarioService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    });
  }

  limpiarForm() {
    this.correo = '';
    this.nacionalidad = '';
    this.usuarioNuevo = '';
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
