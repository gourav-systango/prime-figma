import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone: string;
  profilePicture: string;
  favorites: number[];
}

// Interface for the raw user data from the JSON file
interface UserData extends User {
  password: string;
}

interface UserCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_state';
  private readonly MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
  
  private authStateSubject = new BehaviorSubject<AuthState>(this.getInitialState());
  
  authState$ = this.authStateSubject.asObservable();
  user$ = this.authState$.pipe(map(state => state.user));
  isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  
  login(credentials: UserCredentials): Observable<User> {
    return this.http.get<UserData[]>('mock-data/users.json').pipe(
      map(users => {
        const user = users.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        );
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Remove password from the returned user object
        const { password, ...safeUser } = user;
        
        // Create and store auth state
        const authState: AuthState = {
          user: safeUser,
          token: this.MOCK_TOKEN,
          isAuthenticated: true
        };
        
        this.persistState(authState);
        this.authStateSubject.next(authState);
        
        return safeUser;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid email or password'));
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false
    });
    this.router.navigateByUrl('/');
  }
  
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }
  
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }
  
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }
  
  updateUserProfile(updatedUser: Partial<User>): Observable<User> {
    // In a real app, you would call an API to update the user profile
    // For this mock implementation, we'll just update the local state
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }
    
    // Update user data
    const updatedUserData: User = {
      ...currentUser,
      ...updatedUser
    };
    
    // Update auth state
    const newAuthState: AuthState = {
      ...this.authStateSubject.value,
      user: updatedUserData
    };
    
    this.persistState(newAuthState);
    this.authStateSubject.next(newAuthState);
    
    return of(updatedUserData);
  }
  
  private getInitialState(): AuthState {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error parsing auth state from localStorage:', error);
    }
    
    return {
      user: null,
      token: null,
      isAuthenticated: false
    };
  }
  
  private persistState(state: AuthState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }
}
