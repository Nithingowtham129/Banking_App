import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { TransactionsComponent} from './components/transactions/transactions.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { ContactSupportComponent } from './components/contact-support/contact-support.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { MessageComponent } from './components/message/message.component';
import { AuthGuard } from './Services/auth.guard';



const routes: Routes = [
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/user-login', pathMatch: 'full' },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'transfer', component: TransferComponent, canActivate: [AuthGuard] },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [AuthGuard] },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'contact-support', component: ContactSupportComponent },
  { path: 'profile-card', component: ProfileCardComponent, canActivate: [AuthGuard]},
  { path: 'message', component: MessageComponent, canActivate: [AuthGuard] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
