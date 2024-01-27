import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth/auth.service';
import { ErrorService } from 'src/app/Servicios/error/error.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './RecoveryPassword.component.html',
  styleUrls: ['./RecoveryPassword.component.css']
})
export class RecoveryPasswordComponent {

  confirmationMessage: string = '';
  email: any;

  constructor(private authService: AuthService, private errorService: ErrorService) {
  }

  onSubmit() {
    this.authService.sendRecoveryEmail(this.email).subscribe(
      () => {
        this.confirmationMessage = 'Correo electrónico de recuperación enviado con éxito';
      },
      (error) => {
        this.confirmationMessage = 'Error al enviar el correo electrónico de recuperación';
        this.errorService.msjError(error)
      }
    );
  }


}
