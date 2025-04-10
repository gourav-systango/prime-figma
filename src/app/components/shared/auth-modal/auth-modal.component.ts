import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthModalService } from '../../../services/auth-modal.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SigninForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ScreenDimensions {
  width: number;
  height: number;
  isSmall: boolean;
}

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() mode: 'signin' | 'signup' = 'signin';
  @Output() close = new EventEmitter<void>();
  @Output() modeChange = new EventEmitter<'signin' | 'signup'>();
  @Output() authenticate = new EventEmitter<any>();

  signupForm: SignupForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  signinForm: SigninForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  passwordVisible: boolean = false;
  screenDimensions!: ScreenDimensions;
  private subscription = new Subscription();
  
  // Add error message and loading states
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private authModalService: AuthModalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authModalService.screenDimensions$.subscribe(dimensions => {
        this.screenDimensions = dimensions;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get modalMaxHeight(): string {
    // Return different max-height values based on screen height
    const { height } = this.screenDimensions;
    if (height < 600) {
      return 'max-h-[95vh]'; // Almost full viewport on very small screens
    } else if (height < 800) {
      return 'max-h-[90vh]'; // 90% of viewport on medium screens
    } else {
      return 'max-h-[80vh]'; // 80% of viewport on large screens
    }
  }

  get needsScrolling(): boolean {
    // For signup form which is taller, we need scrolling at smaller heights
    if (this.mode === 'signup') {
      return this.screenDimensions.height < 800;
    }
    // For signin form, only need scrolling on very small screens
    return this.screenDimensions.height < 650;
  }

  closeModal(): void {
    this.resetForms();
    this.close.emit();
  }

  switchMode(mode: 'signin' | 'signup'): void {
    this.errorMessage = null;
    this.modeChange.emit(mode);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.isLoading = true;
    
    if (this.mode === 'signup') {
      // Validate signup form
      if (this.signupForm.password !== this.signupForm.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        this.isLoading = false;
        return;
      }
      
      // In a real app, you would call a signup API here
      // For now, we'll just simulate success after a delay
      setTimeout(() => {
        this.authenticate.emit(this.signupForm);
        this.isLoading = false;
        this.closeModal();
      }, 1000);
    } else {
      // Sign in with our auth service
      this.authService.login({
        email: this.signinForm.email,
        password: this.signinForm.password
      }).subscribe({
        next: (user) => {
          this.authenticate.emit(user);
          this.isLoading = false;
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Invalid email or password';
          this.isLoading = false;
        }
      });
    }
  }
  
  private resetForms(): void {
    this.errorMessage = null;
    this.isLoading = false;
    
    this.signinForm = {
      email: '',
      password: '',
      rememberMe: false
    };
    
    this.signupForm = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }
} 