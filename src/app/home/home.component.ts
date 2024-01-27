import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth/auth.service';
declare var google: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent{

  constructor(private authService: AuthService, private router: Router) {
    localStorage.clear();
  }
}
