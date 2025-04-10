import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthModalService } from '../../../services/auth-modal.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  
  constructor(
    public authModalService: AuthModalService,
    public authService: AuthService
  ) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  openAuthModal(mode: 'signin' | 'signup'): void {
    this.authModalService.openModal(mode);
    // Close mobile menu if it's open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  handleAuthentication(data: any): void {
    console.log('Authentication data:', data);
    // Here we don't need to do anything extra as our auth service
    // already handles the authentication state
    
    // Show a success message
    alert(this.authModalService.modalMode === 'signin' 
      ? 'Successfully signed in!' 
      : 'Account created successfully!');
  }
  
  logout(): void {
    this.authService.logout();
    alert('You have been logged out.');
  }
}
