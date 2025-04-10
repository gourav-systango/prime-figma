import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthModalService } from './auth-modal.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteService {
  constructor(
    private router: Router,
    private authModalService: AuthModalService
  ) {
    this.listenToRouteChanges();
  }

  private listenToRouteChanges(): void {
    // Listen to route changes to detect sign-in and sign-up routes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Check if the URL includes signin or signup
      if (event.url.includes('/signin')) {
        // We're being redirected to home, so open the signin modal
        this.authModalService.openModal('signin');
      } else if (event.url.includes('/signup')) {
        // We're being redirected to home, so open the signup modal
        this.authModalService.openModal('signup');
      }
    });
  }
}
