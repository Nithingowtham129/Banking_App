import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  accounts: any[] = [];
  transactions: any[] = [];
  users: any[] = [];

  accountsPageSize: number = 5;
  accountsCurrentPage: number = 1;

  transactionsPageSize: number = 5;
  transactionsCurrentPage: number = 1;

  usersPageSize: number = 5;
  usersCurrentPage: number = 1;

  activeTab: string = 'accounts'; 
  accountStatuses = ['ACTIVE', 'INACTIVE', 'CLOSED', 'BLOCKED'];
  userStatuses = ['ACTIVE', 'INACTIVE', 'DELETED', 'BLOCKED'];

  accountSearch = '';
  accountTypeFilter = '';
  accountStatusFilter = '';
  filteredAccounts: any[] = [];

  transactionSearch = '';
  transactionTypeFilter = '';
  transactionDateFilter = '';
  filteredTransactions: any[] = [];

  userSearch = '';
  userStatusFilter = '';
  filteredUsers: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchAccounts();
    this.fetchTransactions();
    this.fetchUsers();
  }

  fetchAccounts() {
    this.http.get<any[]>('http://localhost:8080/api/dashboard/admin/accounts')
      .subscribe({
        next: (data) => {
          this.accounts = data.map(acc => ({
            ...acc,
            selectedStatus: acc.status 
          }));
          this.filteredAccounts = this.accounts;
          
        },
        error: (err) => {
          this.accounts = [];
          console.error('Failed to fetch accounts:', err);
        }
      });
  }

  fetchTransactions() {
    this.http.get<any[]>('http://localhost:8080/api/dashboard/admin/transactions')
      .subscribe({
        next: (data) => {
          this.transactions = data;
          this.filteredTransactions = data;
        },
        error: (err) => {
          this.transactions = [];
          console.error('Failed to fetch transactions:', err);
        }
      });
  }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:8080/api/dashboard/admin/users')
      .subscribe({
        next: (data) => {
          this.users = data.map(user => ({
            ...user,
            selectedStatus: user.status 
          }));
          this.filteredUsers = this.users;
        },
        error: (err) => {
          this.users = [];
          console.error('Failed to fetch users:', err);
        }
      });
  }

  updateAccountStatus(accountId: number, newStatus: string) {
  if (!confirm(`Are you sure you want to set status to ${newStatus}?`)) return;
  this.http.post('http://localhost:8080/api/dashboard/admin/update-account-status', { accountId: accountId, status: newStatus }, {responseType : 'text'})
    .subscribe({
      next: (res) => {
        if(res)
        {
          alert('Account status updated successfully.');
          this.ngOnInit();
          this.filterAccounts();
        }
      },
      error: (err) => {
        alert('Failed to update account status.');
        console.error('Update account status error:', err);
      }
    });
}

  updateUserStatus(userId: number, newStatus: string) {
    if (!confirm(`Are you sure you want to set status to ${newStatus}?`)) return;
    this.http.post('http://localhost:8080/api/dashboard/admin/update-user-status', { userId: userId, status: newStatus }, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          if (res) {
            alert('User status updated successfully.');
            this.ngOnInit();
          }
        },
        error: (err) => {
          alert('Failed to update user status.');
          console.error('Update user status error:', err);
        }
      });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/user-login']);
  }

  // Filter methods
  filterAccounts() {
    this.filteredAccounts = this.accounts.filter(acc =>
      (!this.accountSearch ||
        acc.accountNumber.toString().includes(this.accountSearch) ||
        (acc.user?.name || '').toLowerCase().includes(this.accountSearch.toLowerCase())) &&
      (!this.accountTypeFilter || acc.accountType === this.accountTypeFilter) &&
      (!this.accountStatusFilter || acc.status === this.accountStatusFilter.toUpperCase())
    );
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(tx =>
      (!this.transactionSearch ||
        (tx.description || '').toLowerCase().includes(this.transactionSearch.toLowerCase()) ||
        (tx.account?.accountNumber || '').toString().includes(this.transactionSearch)) &&
      (!this.transactionTypeFilter || tx.type === this.transactionTypeFilter) &&
      (!this.transactionDateFilter || tx.date === this.transactionDateFilter)
    );
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      (!this.userSearch ||
        (user.name || '').toLowerCase().includes(this.userSearch.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(this.userSearch.toLowerCase()) ||
        (user.phone || '').includes(this.userSearch)) &&
      (!this.userStatusFilter || user.status === this.userStatusFilter.toUpperCase())
    );
  }
  goToMessages() {
    this.router.navigate(['/message']);
  }
}
