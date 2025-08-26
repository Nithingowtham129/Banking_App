import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-message',
  standalone: false,
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  subject: string = '';
  message: string = '';
  sending: boolean = false;
  responseText: string = '';

  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  sendMessage() {
    if (!this.subject.trim() || !this.message.trim()) return;
    this.sending = true;
    const payload = {
      subject: this.subject,
      message: this.message
    };
    
    this.http.post(`${this.baseUrl}/api/auth/admin/send-message`, payload, { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          this.responseText = res;
          this.sending = false;
          this.subject = '';
          this.message = '';
        },
        error: () => {
          this.responseText = 'Failed to send message.';
          this.sending = false;
        }
      });
  }
  goBack() {
    window.history.back();
  }
}
