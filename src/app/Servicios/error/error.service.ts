import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastr: ToastrService) { }

  msjError(event: HttpErrorResponse | undefined) {
    
    if (!event) {
      console.error('Error undefined'); // Agrega un log o mensaje si event es undefined
      return;
    }

    if (event.error && event.error.msg) {
      this.toastr.error(event.error.msg, 'Error');
    } else if (event.status === 401 ) {
      this.toastr.error(event.error.msg, 'Error');
    }else {
      this.toastr.error(`${event}`, 'Error');
    }
  }

}
