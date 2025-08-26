import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
 
@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  private baseUrl = environment.apiUrl;

  email: string = '';
  password: string = '';
  loggingIn: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    if (this.loggingIn) return;
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>(`${this.baseUrl}/api/auth/admin/login`, payload)
      .subscribe({
        next: (resultData) => {
          if (resultData.message === "Login successful") {
            sessionStorage.setItem('jwtToken', resultData.token);
            sessionStorage.setItem('token', 'true');
            this.router.navigate(['/admin-home']);
          }  else if (resultData.message === "Invalid credentials") {
            alert("Invalid credentials. Please try again.");
          }
          else {
            alert("An unexpected error occurred..");
          }
        },
        error: () => {
          alert("An unexpected error occurred.");
        }
      });
  }
}
