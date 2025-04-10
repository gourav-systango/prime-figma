import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModalService } from '../../../services/auth-modal.service';

interface ForgotPasswordForm {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: ForgotPasswordForm = {
    email: ''
  };
  
  isSubmitting: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private authModalService: AuthModalService
  ) {}

  onSubmit(): void {
    if (!this.form.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }
    
    // Reset error state
    this.errorMessage = null;
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would call your auth service here
      this.isSubmitting = false;
      this.isSuccess = true;
      
      // Reset form after 5 seconds to allow user to retry if needed
      setTimeout(() => {
        this.isSuccess = false;
        this.form.email = '';
      }, 5000);
    }, 1500);
  }

  returnToSignIn(): void {
    this.router.navigateByUrl('/');
    setTimeout(() => {
      this.authModalService.openModal('signin');
    }, 100);
  }
}
