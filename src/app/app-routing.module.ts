import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AccountComponent } from './home/account/account.component';
import { HistoryComponent } from './home/account/history/history.component';
import { ProfileComponent } from './home/account/profile/profile.component';
import { ServicesTicketsComponent } from './home/account/services-tickets/services-tickets.component';
import { authGuard } from './utils/auth.guard';
import { UsersComponent } from './home/account/users/users.component';
import { TicketComponent } from './home/account/ticket/ticket.component';
import { TechnicalComponent } from './home/account/technical/technical.component';
import { DashboardComponent } from './home/account/dashboard/dashboard.component';
import { ChatComponent } from './home/account/chat/chat.component';
import { LogsComponent } from './home/account/logs/logs.component';
import { RecoveryPasswordComponent } from './error/RecoveryPassword/RecoveryPassword.component';
import { ResetPasswordComponent } from './error/ResetPassword/ResetPassword.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "account", redirectTo: "account/profile", pathMatch: "full" },
  {
    path: "account", component: AccountComponent, canActivate: [authGuard],
    children: [
      { path: 'logs', component: LogsComponent, canActivate: [authGuard] },
      { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'services', component: ServicesTicketsComponent, canActivate: [authGuard] },
      { path: "dashboard", component: DashboardComponent, canActivate: [authGuard] },
      { path: "chat", component: ChatComponent, canActivate: [authGuard] },
      { path: "users", component: UsersComponent, canActivate: [authGuard] },
      { path: "tickets", component: TicketComponent, canActivate: [authGuard] },
      { path: "technical", component: TechnicalComponent, canActivate: [authGuard] }
    ]
  },
  { path: "recovery-password", component:  RecoveryPasswordComponent},
  { path: "reset/:token", component:  ResetPasswordComponent },
  { path: "**", component: ErrorComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
