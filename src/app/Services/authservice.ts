import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userId: number | null = null;

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(user: any) {
    return this.http.post(`${this.baseUrl}/api/auth/register`, user, { responseType: 'text' });
  }

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/api/auth/login`, credentials);
  }

  sendOtp(email: string) {
    return this.http.post(`${this.baseUrl}/api/auth/passwordReset/send-otp`, { email: email.trim() }, { responseType: 'text' });
  }

  verifyOtp(email: string, enteredOtp: string) {
    return this.http.post(`${this.baseUrl}/api/auth/verify-otp`, { email: email.trim(), otp: enteredOtp }, { responseType: 'text' });
  }

  changePassword(payload: { email: string, newPassword: string }) {
    return this.http.post(`${this.baseUrl}/api/auth/change-password`, payload, { responseType: 'text' });
  }


}
