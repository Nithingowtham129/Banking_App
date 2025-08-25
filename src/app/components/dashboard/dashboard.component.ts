import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InactivityService } from '../../Services/inactivity-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userId: number | null = null;
  userName: string = ''; 
  accounts: any[] = [];
  transactions: any[] = [];
  showBalance: boolean = false;

  constructor(private router: Router, private http: HttpClient, private InactivityService: InactivityService) {}

  ngOnInit() {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.userId = userId ? +userId : null;

    if (this.userId !== null) {
      this.http.get<{ userName: string, accounts: any[]}>(`http://localhost:8080/api/dashboard/${this.userId}`)
        .subscribe({
          next: (res) => {
            this.userName = res.userName;

            this.accounts = res.accounts.map(acc => ({
              ...acc,
              icon: acc.accountType === 'Savings'
                ? 'fas fa-piggy-bank'
                : acc.accountType === 'Current'
                  ? 'far fa-credit-card'
                  : acc.accountType === 'Business'
                    ? 'fas fa-briefcase'
                    : 'fas fa-university',
              iconClass: acc.accountType === 'Savings'
                ? 'bg-success'
                : acc.accountType === 'Current'
                  ? 'bg-primary'
                  : acc.accountType === 'Business'
                    ? 'bg-warning'
                    : 'bg-secondary'
            }));
          },
          error: () => {
            this.userName = 'John Doe';
            this.accounts = [];
          }
        });


      // Fetch transactions
      this.http.get<any[]>(`http://localhost:8080/api/dashboard/user/${this.userId}`)
        .subscribe({
          next: (res) => {
            this.transactions = res.map(tx => ({
              name: tx.description,
              type: tx.type === 'debit' ? 'Debit' : 'Credit',
              date: tx.date,
              account: tx.account.accountType + ' (' + tx.account.accountNumber + ')',
              amount: (tx.type === 'debit' ? '- ' : '+ ') + tx.amount,
              amountClass: tx.type === 'debit'
                ? 'text-danger small fw-semibold'
                : 'text-success small fw-semibold',
              icon: tx.type === 'debit' ? 'fas fa-arrow-up' : 'fas fa-arrow-down',
              iconClass: tx.type === 'debit' ? 'bg-danger-light' : 'bg-success-light'
            })).slice(-3).reverse();
          },
          error: () => {
            this.transactions = [];
          }
        });
    }
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }

  menuVisible = true;

  newTransaction = {
    type: 'debit',
    amount: null,
    description: '',
    accountId: ''
  };

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/user-login']);
  }

  submitTransaction() {
    this.http.post('http://localhost:8080/api/accounts/transactions', this.newTransaction, { responseType: 'text' })
    .subscribe({
      next: (res) => {
        if (res === "Transaction successful.") {
          this.ngOnInit();
        }
        else if (res === "Insufficient balance") {
          alert('Transaction failed: Insufficient balance in your Account.');
        }
        else if (res === "Your Account is not Active, Contact Support !!") {
          alert('Transaction failed: Your Account is not Active, Contact Support !!');
        }
        else {
          alert('Transaction failed: ' + res);
        }
      },
      error: (err) => {
        const backendMsg = err.error?.message || err.error || err.message;
        alert('Transaction failed: ' + backendMsg);
        console.error('Transaction error:', backendMsg);
      }
    });

    // Close modal after submit 
    const modal = document.getElementById('addTransactionModal');
    if (modal) {
      (window as any).bootstrap.Modal.getInstance(modal)?.hide();
    }

    // Optionally reset form
    this.newTransaction = {
      type: 'debit',
      amount: null,
      description: '',
      accountId: ''
    };
  }

  openAddTransactionModal(type: string) {
    this.newTransaction.type = type;
    // Open the modal using Bootstrap JS
    const modal = document.getElementById('addTransactionModal');
    if (modal) {
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }

}