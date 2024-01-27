import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorService } from '../Servicios/error/error.service';
import { Router } from '@angular/router';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({ setHeaders: { 'Authorization': `Bearer ${token}` } });
    }

    return next.handle(request).pipe(
      catchError((event: HttpErrorResponse) => {
        if (event.status === 401) {
          this.errorService.msjError(event.error.msg);
          this.router.navigate(['/home']);
        }
        return throwError(() => event);
      })

    );
  }
}
