import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { InactivityService } from '../../Services/inactivity-service.service';
import { AuthService } from '../../Services/authservice';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-profile-card',
  standalone: false,
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent implements OnInit {

  constructor(private location: Location, private http: HttpClient, private InactivityService: InactivityService, private authService: AuthService) {}

  private baseUrl = environment.apiUrl;

  profileImage: string = '';
  userId: number | null = null;
  name: string = '';
  emailId: string = '';
  phone: string = '';
  address: string = '';
  status: string = '';
  memberSince: string = '';
  accounts: { accountNumber: string; accountType: string; balance: number }[] = [];

  loggingIn: boolean = false; 
  otpSent: boolean = false;
  forgotEmail: string = '';
  enteredOtp: string = '';
  otpError: string = '';
  newPassword: string = '';

  email: string = '';
  password: string = '';
  otp: string = '';
  showForgotEmailDialog: boolean = false;
  otpSending: boolean = false;
  otpMessage: string = '';
  otpVerified: boolean = false;

  ngOnInit(): void {
  const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
  this.userId = userId ? +userId : null;

  if (this.userId !== null) {
    const requestBody = { userId: this.userId };

    this.http.post<any>(`${this.baseUrl}/api/dashboard/profile`, requestBody, { responseType: 'json' as const }).subscribe({
      next: (res) => {
        console.log('User profile:', res);
        this.name = res.name || 'John Doe';
        this.emailId = res.email || 'not provided';
        this.phone = res.phone || 'not provided';
        this.address = res.address || 'not provided';
        this.status = res.status || 'not provided';
        this.memberSince = res.memberSince || 'not provided';
        this.accounts = res.accounts || [];

      },
      error: (err) => {
        console.error('Error fetching profile data:', err);
      }
    });
  }
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

onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

goBack() {
  this.location.back();
}

openDialog(){
    // alert("Please contact customer support to reset your password.");
    this.showForgotEmailDialog = true;
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
