import { NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {

  private timeoutInMs: number = 5 * 60 * 1000; 
  private timer: any;

  constructor(private router: Router, private ngZone: NgZone) {
    this.startTracking();
  }

  startTracking(): void {
    this.resetTimer();

    // Reset timer on any of these events
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keydown', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
    window.addEventListener('touchstart', () => this.resetTimer());
  }

  resetTimer(): void {
    clearTimeout(this.timer);

    this.ngZone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.logoutUser();
      }, this.timeoutInMs);
    });
  }

  logoutUser(): void {
    this.ngZone.run(() => {
      sessionStorage.clear(); 
      alert('You have been logged out due to inactivity.');
      this.router.navigate(['/user-login']);
    });
  }
}
