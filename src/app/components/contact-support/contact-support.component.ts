import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-contact-support',
  standalone: false,
  templateUrl: './contact-support.component.html',
  styleUrl: './contact-support.component.css'
})
export class ContactSupportComponent {

  private baseUrl = environment.apiUrl;
  message = '';
  loading = false;

  constructor(private http: HttpClient, private location: Location) {}

  onSubmit(form: any): void {
  if (form.valid) {
    this.loading = true;
    this.http.post(`${this.baseUrl}/api/userRequest/contact-support`, form.value, {
      responseType: 'text'
    }).subscribe({
      next: (res) => {
        this.message = res; 
        form.resetForm();
        this.loading = false;
      },
       error: (err) => {
        console.error('Error:', err);
        this.message = err;
        this.loading = false;
      }
    });
  }
}

  goBack(): void {
    this.location.back(); 
  }

}
