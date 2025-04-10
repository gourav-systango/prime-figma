import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ScreenDimensions {
  width: number;
  height: number;
  isSmall: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private _isModalOpenSubject = new BehaviorSubject<boolean>(false);
  private _modalModeSubject = new BehaviorSubject<'signin' | 'signup'>('signin');
  private _screenDimensionsSubject = new BehaviorSubject<ScreenDimensions>({
    width: 0,
    height: 0,
    isSmall: false
  });

  isModalOpen$ = this._isModalOpenSubject.asObservable();
  modalMode$ = this._modalModeSubject.asObservable();
  screenDimensions$ = this._screenDimensionsSubject.asObservable();

  get isModalOpen(): boolean {
    return this._isModalOpenSubject.value;
  }

  get modalMode(): 'signin' | 'signup' {
    return this._modalModeSubject.value;
  }

  get isSmallScreen(): boolean {
    return this._screenDimensionsSubject.value.isSmall;
  }

  get screenDimensions(): ScreenDimensions {
    return this._screenDimensionsSubject.value;
  }

  constructor() {
    // Check initial screen size
    this.checkScreenSize();
    
    // Listen for window resize events
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this._screenDimensionsSubject.next({
        width,
        height,
        isSmall: width < 640
      });
    }
  }

  openModal(mode: 'signin' | 'signup' = 'signin'): void {
    this._modalModeSubject.next(mode);
    this._isModalOpenSubject.next(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this._isModalOpenSubject.next(false);
    // Allow scrolling again
    document.body.style.overflow = '';
  }

  setMode(mode: 'signin' | 'signup'): void {
    this._modalModeSubject.next(mode);
  }

  toggleModal(): void {
    const currentValue = this._isModalOpenSubject.value;
    this._isModalOpenSubject.next(!currentValue);
    document.body.style.overflow = !currentValue ? 'hidden' : '';
  }
} 