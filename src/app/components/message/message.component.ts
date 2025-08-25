import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  sendMessage() {
    if (!this.subject.trim() || !this.message.trim()) return;
    this.sending = true;
    const payload = {
      subject: this.subject,
      message: this.message
    };
    
    this.http.post('http://localhost:8080/api/auth/admin/send-message', payload, { responseType: 'text' })
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
