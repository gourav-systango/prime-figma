import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthModalService } from './auth-modal.service';
import { MessageService } from 'primeng/api';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private authModalService: AuthModalService,
    private messageService: MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    // Check if user is logged in
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    
    // Not logged in, so open the auth modal
    this.authModalService.openModal('signin');
    
    // Show a message to the user using Toast instead of alert
    this.messageService.add({
      severity: 'info',
      summary: 'Authentication Required',
      detail: 'Please log in to access this page'
    });
    
    // Navigate to the home page
    this.router.navigate(['/']);
    
    return false;
  }
}
