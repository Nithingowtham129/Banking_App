import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { InactivityService } from '../../Services/inactivity-service.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {

  private baseUrl = environment.apiUrl;

  menuVisible = true;
  selectedAccount = 'All Accounts';
  userId: number | null = null;
  userName: string = '';

  pageSize : number = 5;
  currentPage : number = 1;

  transactions: any[] = [];
  filteredTransactions: any[] = [];
  searchTerm: string = '';

  filterAccountType: string = '';
  filterTransactionType: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';
  accountTypes: string[] = [];

  constructor(private http: HttpClient, private router: Router, private InactivityService: InactivityService) {}

  ngOnInit() {
    this.userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    if (this.userId) {
      this.http.get<any[]>(`${this.baseUrl}/api/dashboard/user/${this.userId}`)
        .subscribe({
          next: (res) => {
            this.transactions = res.map(tx => ({
              id: tx.id,
              date: tx.date,
              description: tx.description,
              account: tx.account.accountType + ' (' + tx.account.accountNumber + ')',
              amount: tx.type === 'debit' ? -tx.amount : tx.amount,
              type: tx.type 
            })).reverse();
            this.filteredTransactions = this.transactions;
            this.userName = res.length > 0 ? res[0].account.user.name : 'John Doe';

            // Populate accountTypes from your transactions/accounts
            this.accountTypes = Array.from(new Set(this.transactions.map(t => t.account)));
            this.filterTransactions();
          },
          error: () => {
            this.transactions = [];
            this.filteredTransactions = [];
            this.userName = 'John Doe';
          }
        });
    }
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/user-login']);
  }

  gotoDashboard()
  {
    this.router.navigate(['/dashboard']);
  }

  gotoAccounts()
  {
    this.router.navigate(['/accounts']);
  }

  gotoTransfer()
  {
    this.router.navigate(['/transfer']);
  }

  contactSupport() {
    this.router.navigate(['/contact-support']);
  }

  searchTransactions() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTransactions = this.transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(term) ||
      transaction.account.toLowerCase().includes(term)
    );
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesAccount = !this.filterAccountType || t.account === this.filterAccountType;
      const matchesType = !this.filterTransactionType || t.type === this.filterTransactionType;
      const matchesFrom = !this.filterFromDate || new Date(t.date) >= new Date(this.filterFromDate);
      const matchesTo = !this.filterToDate || new Date(t.date) <= new Date(this.filterToDate);
      const matchesSearch = !this.searchTerm || 
        t.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.account.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (t.id + '').includes(this.searchTerm);
      return matchesAccount && matchesType && matchesFrom && matchesTo && matchesSearch;
    });
  }
}
