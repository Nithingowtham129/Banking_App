import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InactivityService } from '../../Services/inactivity-service.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-transfer',
  standalone: false,
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'] 
})
export class TransferComponent {
 menuVisible: boolean = true;

  constructor(private router: Router,private http: HttpClient, private InactivityService: InactivityService ) {}

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  private baseUrl = environment.apiUrl;

  userId: number | null = null;
  currentStep: number = 1;
  fromAccount: string = '';
  toAccount: string = '';
  amount: number | null = null;
  paymentMethod: string = '';
  userName: string = 'John Doe';
  accounts: any[] = []; 

  ngOnInit() {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.userId = userId ? +userId : null;

    if (this.userId !== null) {
      
      this.http.get<any>(`${this.baseUrl}/api/dashboard/${this.userId}`)
        .subscribe({
          next: (res) => {
            this.userName = res.userName;
            this.accounts = res.accounts || [];
          },
          error: () => {
            this.userName = 'John Doe';
            this.accounts = [];
          }
        });
    }
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/user-login']);
  }

  goToStep(step: number): void {
    this.currentStep = step;
    if (step === 1) {
      
    this.fromAccount = '';
    this.toAccount = '';
    this.amount = null;
    this.paymentMethod = '';
    }
  }

  confirmTransfer(): void {
    
    const payload = {
      fromAccountNumber: this.fromAccount,
      toAccountNumber: this.toAccount,
      amount: this.amount
    };

    this.http.post(`${this.baseUrl}/api/accounts/transfer`, payload, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          if (res === 'Transfer successful') {
            this.currentStep = 4;
          } 
        },
        error: (err) => {
          let errorMsg = 'Transfer failed, Check credentials and try again';

          if (typeof err === 'string') {
            errorMsg = err;
          }
          
          else if (err.error && typeof err.error === 'string') {
            errorMsg = err.error;
          }

          else if (err.message) {
            errorMsg = err.message;
          }

          alert(errorMsg);
          this.currentStep = 1;
          this.ngOnInit();
        }
        });
  }

  get selectedFromAccount() {
    return this.accounts.find(acc => acc.accountNumber === this.fromAccount);
  }
}
