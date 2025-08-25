import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InactivityService } from '../../Services/inactivity-service.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit { 

  accounts: any[] = [];
  userName: string = 'John Doe'; // Default user name
  creditedAmount: number = 0;
  debitedAmount: number = 0;
  showBalance: boolean = false;

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, private InactivityService: InactivityService) {

    this.router.events.subscribe((val) => {
    
  });

  }

  userId = parseInt(sessionStorage.getItem('userId') || '0', 10);

  ngOnInit() {
    if (this.userId !== null) {
      this.http.get<{ userName: string, accounts: any[] }>(`http://localhost:8080/api/dashboard/${this.userId}`)
        .subscribe({
          next: (res) => {
            this.userName = res.userName;
            this.accounts = res.accounts;

            // Calculate total balance dynamically
            const total = this.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
            this.summary.totalBalance = `₹ ${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

          },
          error: () => {
            this.userName = 'John Doe';
            this.accounts = [];
            this.summary.totalBalance = '₹ 0.00';
          }
        });
    }


    this.http.get<number>(`http://localhost:8080/api/accounts/credit-monthly/${this.userId}`).subscribe({
      next: (amount) => {
        this.creditedAmount = amount;
        // Format and set monthlyIncome in summary
        this.summary.monthlyIncome = `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
      error: (err) => {
        console.error('Failed to fetch credit:', err);
        this.summary.monthlyIncome = '₹ 0.00';
      }
    });

    this.http.get<number>(`http://localhost:8080/api/accounts/debit-monthly/${this.userId}`).subscribe({
      next: (amount) => {
        this.debitedAmount = amount;
        // Format and set monthlyIncome in summary
        this.summary.monthlyExpenses = `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
      error: (err) => {
        console.error('Failed to fetch credit:', err);
        this.summary.monthlyExpenses = '₹ 0.00';
      }
    });

  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }

  menuVisible = true;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  summary = {
    totalBalance: '₹ 0.00',
    monthlyIncome: '₹ 0.00',
    monthlyExpenses: '₹ 0.00'
  };

  goToDashboard()
  {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/user-login']);
  }

  goToTransactions()
  {
    this.router.navigate(['/transactions']);
  }

  goTotransfer()
  {
    this.router.navigate(['/transfer']);
  }

  contactSupport() {
    this.router.navigate(['/contact-support']);
  }

  showAccountModal = false;

  newAccount = {
    accountNumber: generateRandomAccountNumber(),
    accountType: '',
    balance: null,
    user: { userId: this.userId }
  };

  openAccountModal() {
    this.newAccount = {
      accountNumber: generateRandomAccountNumber(),
      accountType: '',
      balance: null,
      user: { userId: this.userId }
    };
    this.showAccountModal = true;
  }

  creatingAccount = false;

  submitNewAccount() {
    this.creatingAccount = true; // Disable button
    this.http.post('http://localhost:8080/api/accounts', this.newAccount)
      .subscribe({
        next: () => {
          this.showAccountModal = false;
          this.creatingAccount = false; // Re-enable button
          alert('New account created successfully!');
          this.ngOnInit();
        },
        error: (err) => {
          this.creatingAccount = false; // Re-enable button
          let errorMessage = 'Failed to create new account. Please try again.';
          if (err.error && typeof err.error === 'string') {
            errorMessage = err.error;
          }
          alert(errorMessage);
        }
      });
  }

}

function generateRandomAccountNumber(): string {
  // Generates a string with 11 random digits, first digit is not zero
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  let number = firstDigit.toString();
  for (let i = 0; i < 10; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}