import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { OnInit } from '@angular/core';
import { AuthService } from '../../Services/authservice';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit {

  loggingIn: boolean = false; 
  otpSent: boolean = false;
  forgotEmail: string = '';
  enteredOtp: string = '';
  otpError: string = '';

  ngOnInit() {
    sessionStorage.clear();
  }
  
  email: string = '';
  password: string = '';
  otp: string = '';
  showForgotEmailDialog: boolean = false;
  otpSending: boolean = false;
  otpMessage: string = '';
  otpVerified: boolean = false;

  newPassword: string = '';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loggingIn = true; // Disable button

    const loginData = {
      email: this.email.trim(),
      password: this.password.trim()
    };

    this.authService.login(loginData)
      .subscribe({
        next: (resultData: any) => {
          this.loggingIn = false; 
          if(resultData.message == "email Does not Exist") {
            alert("Email does not exist");
          }
          else if(resultData.message == "Password Does not Match") {
            alert("Password is incorrect");
          }
          else if(resultData.message == "Login Success") {
            const userId = resultData.userId;
            sessionStorage.clear();
            sessionStorage.setItem('token', 'true');  
            sessionStorage.setItem('jwtToken', resultData.token);
            sessionStorage.setItem('userId', userId.toString());
            this.router.navigate(['/dashboard']);
          }
          else {
            alert("An unexpected error occurred: ");
          }
        },
        error: (err) => {
          this.loggingIn = false;
          if (err.status === 401) {
            if (err.error?.message === "Email does not exist") {
              alert("Email does not exist");
            } else if (err.error?.message === "Password does not match") {
              alert("Password is incorrect");
            } else {
              alert("Unauthorized: " + (err.error?.message || "Unknown error"));
            }
          } else {
            alert("An unexpected error occurred: ");
          }
        }
      });
  }

  openDialog(){
    this.showForgotEmailDialog = true;
  }

  sendOtp() {
    if (!this.forgotEmail) return;
    this.otpSending = true;
    this.otpMessage = '';

    this.authService.sendOtp(this.forgotEmail).subscribe({
      next: (res) => {
        if (res === 'OTP sent successfully') {
          this.otpMessage = 'OTP sent to your email!';
          this.otpSent = true;
        } else {
          this.otpMessage = 'Failed to send OTP. Please try again.';
        }
        this.otpSending = false;
      },
      error: (error) => {
        this.otpSending = false;
        if (error.status === 400 && error.error === 'Email does not exist') {
          this.otpMessage = 'This email is not registered with us.';
        } else {
          this.otpMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }

  verifyOtp() {
    if (!this.forgotEmail || !this.enteredOtp) return;
    this.authService.verifyOtp(this.forgotEmail, this.enteredOtp).subscribe({
      next: (res) => {
        if (res === 'OTP verified successfully') {
          this.otpError = '';
          this.otpVerified = true;
        } else {
          this.otpError = 'Invalid OTP';
        }
      },
      error: (err) => {
        this.otpError = 'OTP verification Failed';
        if (err === "Invalid OTP")
        {
          this.otpError = 'Invalid OTP';
        }
      }
    });

  }

  closeDialog()
  {
    this.showForgotEmailDialog = false;
    this.forgotEmail = '';
    this.newPassword = '';
    this.enteredOtp = '';
    this.otpSent = false;
    this.otpVerified = false;
    this.otpMessage = '';
    this.otpError = '';
    this.showForgotEmailDialog = false;
  }

  
  resetPassword() {

    const payload = {
    email: this.forgotEmail,
    newPassword: this.newPassword
    };

    this.authService.changePassword(payload)
    .subscribe({
      next: (response) => {
        alert(response); 
        this.showForgotEmailDialog = false;
        this.forgotEmail = '';
        this.newPassword = '';
        this.enteredOtp = '';
        this.otpSent = false;
        this.otpVerified = false;
        this.otpMessage = '';
        this.otpError = '';
        this.showForgotEmailDialog = false;
      },
      error: (error) => {
        alert('Password reset failed. Please try again.');
        console.error(error);
      }
    });
  }

}
