import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Servicios/auth/auth.service';
import { ErrorService } from 'src/app/Servicios/error/error.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './ResetPassword.component.html',
  styleUrls: ['./ResetPassword.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  token: string | any = '';
  submitted = false;
  loading = false;
  success = false;
  confirmPassword: string = '';
  password: string = ''; // Add this line to bind the password input field

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorService,
    private toastrService: ToastrService
  ) {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
  
    // Verificar si las contraseñas coinciden
    if (this.password != this.confirmPassword) {
      this.toastrService.error('Las contraseñas no coinciden');
      this.loading = false;
      return;
    }
  
    this.authService.resetPassword(this.token, this.password).subscribe(
      (next: any) => {
        this.toastrService.success(next.msg)
        this.success = true;
        this.loading = false;
      },
      (error) => {
        this.errorService.msjError(error);
        this.loading = false;
      }
    );
  }
  
}
