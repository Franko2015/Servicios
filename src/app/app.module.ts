import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { AddTokenInterceptor } from './utils/add-token.interceptor';
import { ChatComponent } from './home/account/chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';


import { HomeComponent } from './home/home.component';
import { NavComponent } from './home/nav/nav.component';
import { AccountComponent } from './home/account/account.component';
import { ErrorComponent } from './error/error.component';
import { HistoryComponent } from './home/account/history/history.component';
import { NavChatComponent } from './home/account/nav-chat/nav-chat.component';
import { ServicesTicketsComponent } from './home/account/services-tickets/services-tickets.component';
import { TicketComponent } from './home/account/ticket/ticket.component';
import { UsersComponent } from './home/account/users/users.component';
import { FooterComponent } from './home/footer/footer.component';
import { LoginComponent } from './home/nav/login/login.component';
import { ServicesComponent } from './home/services/services.component';
import { DashboardComponent } from './home/account/dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LogsComponent } from './home/account/logs/logs.component';
import { TechnicalComponent } from './home/account/technical/technical.component';
import { RecoveryPasswordComponent } from './error/RecoveryPassword/RecoveryPassword.component';
import { ResetPasswordComponent } from './error/ResetPassword/ResetPassword.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    AccountComponent,
    HistoryComponent,
    LoginComponent,
    ErrorComponent,
    FooterComponent,
    ServicesComponent,
    ServicesTicketsComponent,
    ChatComponent,
    TicketComponent,
    UsersComponent,
    NavChatComponent,
    DashboardComponent,
    LogsComponent,
    TechnicalComponent,
    RecoveryPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    NgxChartsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AddTokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http)
}
