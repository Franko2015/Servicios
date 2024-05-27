import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, UserLogin } from 'src/app/Servicios/auth/auth.service';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { PaisesService } from 'src/app/Servicios/otros/paises.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/Servicios/error/error.service';
declare var google: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nuevo: boolean = false

  username: string = '';
  password: string = '';
  validacion: string = 'Ingrese a su cuenta';

  usernameNuevo: string = '';
  passwordNuevo: string = '';
  passwordNuevoMisma: string = '';
  rut_usuarioNuevo: string = '';
  nombreNuevo: string = '';
  ape_paternoNuevo: string = '';
  ape_maternoNuevo: string = '';
  correoNuevo: string = '';
  usuarioNuevo: string = '';
  nacionalidad: string = '';

  paises: any = [];

  validacionNuevo: string = 'Ingrese sus datos para registrarse';

  constructor(private router: Router, private trad: TranslateService, private authService: AuthService, private usuariosService: UsuariosService, private paisesService: PaisesService, private location: Location, private toastr: ToastrService, private errorService: ErrorService) {

    this.paisesService.getPaises().subscribe(
      data => {
        this.paises = data;
      },
      error => {
        console.error(error);
      }
    );
  }


  validacionesRegistrado() {
    let validadoRegistrado = false;

    if (this.username === '') {
      this.toastr.warning('Ingrese un usuario')
    } else if (this.password === '') {
      this.toastr.warning('Ingrese una contraseña')
    } else {
      this.validacion = 'Presione el botón "INGRESAR" para Iniciar Sesión';
      return validadoRegistrado = true;
    }
    return validadoRegistrado;
  }

  validacionesNuevo() {
    if (!this.rut_usuarioNuevo) {
      this.toastr.warning('Ingrese su RUT')
    } else if (!this.usuarioNuevo) {
      this.toastr.warning('Ingrese un usuario')
    } else if (!this.passwordNuevo) {
      this.toastr.warning('Ingrese una contraseña')
    } else if (this.passwordNuevo !== this.passwordNuevoMisma) {
      this.toastr.warning('Las contraseñas no coinciden')
    } else if (!this.rut_usuarioNuevo) {
      this.toastr.warning('Ingrese un RUT')
    } else if (!this.nombreNuevo) {
      this.toastr.warning('Ingrese un nombre')
    } else if (!this.ape_paternoNuevo) {
      this.toastr.warning(this.validacionNuevo = 'Ingrese un apellido paterno')
    } else if (!this.ape_maternoNuevo) {
      this.toastr.warning('Ingrese un apellido materno')
    } else if (!this.correoNuevo) {
      this.toastr.warning('Ingrese un correo')
    } else {
      this.validacionNuevo = 'Presione el botón "REGISTRAR" para Iniciar Sesión';
      return true;
    }
    return false;
  }

  onSubmit() {

    if (this.nuevo && this.validacionesNuevo() === true) {

      let nuevoUsuario = {
        rut_usuario: this.rut_usuarioNuevo,
        nombre: this.nombreNuevo,
        apellido_paterno: this.ape_paternoNuevo,
        apellido_materno: this.ape_maternoNuevo,
        correo: this.correoNuevo,
        contrasena: this.passwordNuevo,
        rut: this.rut_usuarioNuevo,
        usuario: this.usuarioNuevo,
        nacionalidad: this.nacionalidad,
        tipo_cuenta: "CLIENTE"
      };

      this.usuariosService.create(nuevoUsuario).subscribe({
        next: (data: any) => {

          this.toastr.show(data.msg);
          this.router.navigate(['/home']);
          this.nuevo = false;

        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error(error.error.msg);
        }
      })
    } else if (!this.nuevo && this.validacionesRegistrado() === true) {

      let usuario: UserLogin = {
        usuario: this.username,
        contrasena: this.password
      }

      this.authService.login(usuario).subscribe({
        next: (data: any) => {
          const datos = data.user
          this.toastr.show(data.msg);

          localStorage.setItem("UserId", datos.rut_usuario);
          localStorage.setItem("token", data.token);

          this.router.navigate(['/account']);
        },
        error: (event: HttpErrorResponse) => {
          this.errorService.msjError(event.error.msg);
        }
      });

    }
  }

  logOut() {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/home']);
    }
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }


}
