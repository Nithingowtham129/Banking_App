import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../Services/authservice';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-register-user',
  standalone: false,
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {

  private baseUrl: string = environment.apiUrl;

  Name: string = '';
  Email: string = '';
  Phone: string = '';
  Password: string = '';
  confirmPassword: string = '';
  address: string = '';

  registering: boolean = false;
  otpSending: boolean = false;
  otpMessage: string = '';

  generatedOtp: string = '';
  enteredOtp: string = '';
  otpVerified: boolean | null = null;

  private lastEmail: string = '';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient ) {}

  onRegister(form: NgForm) {

    if (form.invalid) {
    alert('Please fill all required fields.');
    return;
    }

    this.registering = true; // Disable button

    const userData = {
      name: this.Name,
      email: this.Email,
      phone: this.Phone,
      password: this.Password,
      confirmPassword: this.confirmPassword,
      address: this.address
    };

    // Logic for user registration

    this.authService.register(userData)
    .subscribe({
    next: (resultData: string) => {
      this.registering = false; // Re-enable button
      if (resultData === 'Email already registered') {
        this.router.navigate(['/user-login']);
      }

      if (resultData === 'User registered successfully.') {
        alert('User registered successfully');
        this.router.navigate(['/user-login']);
      }
      else {
        alert('Registration failed: ' + resultData);
      }
      },
      error: (err) => {
        this.registering = false; // Re-enable button
        console.error('Error occurred during registration:', err);
        alert('An error occurred during registration.');
      }
    });

  }

  sendOtp() {
    if (!this.Email) return;
    this.otpSending = true;
    this.otpMessage = '';
    this.otpVerified = null;

    this.http.post(`${this.baseUrl}/api/auth/send-otp`, {
      email: this.Email
    }, { responseType: 'text' }).subscribe({
      next: (res) => {
        if (res === 'OTP sent successfully') {
          this.otpMessage = 'OTP sent to your email!';
        } else if (res === 'Email already registered') {
          this.otpMessage = 'Email already registered. Please use a different email or login.';
        } else {
          this.otpMessage = 'Failed to send OTP. Please try again.';
        }
        this.otpSending = false;
      },
      error: (err) => {
        if (err.error === 'Email already registered') {
          this.otpMessage = 'Email already registered. Please use a different email or login.';
        } else {
          this.otpMessage = 'Failed to send OTP. Please try again.';
        }
        this.otpSending = false;
      }
    });
  }

  verifyOtp() {
    if (!this.Email || !this.enteredOtp) return;
    this.http.post(`${this.baseUrl}/api/auth/verify-otp`, {
      email: this.Email,
      otp: this.enteredOtp
    }, { responseType: 'text' }).subscribe({
      next: (res) => {
        if (res === 'OTP verified successfully') {
          this.otpVerified = true;
        } else {
          this.otpVerified = false;
        }
      },
      error: () => {
        this.otpVerified = false;
      }
    });
  }

  hideConfirmPassword: boolean = false;

  ngDoCheck() {
    if (this.Email !== this.lastEmail) {
      this.otpVerified = null;
      this.otpMessage = '';
      this.enteredOtp = '';
      this.lastEmail = this.Email;
    }
  }
}