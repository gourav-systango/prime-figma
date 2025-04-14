import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private favouriteItems = new BehaviorSubject<Product[]>([]);
  private storageName = 'favourite_items';

  constructor(private authService: AuthService) {
    // Load favourites from localStorage on service initialization
    this.loadFavourites();
    
    // Subscribe to auth state changes to reload or clear favorites when login/logout occurs
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadFavourites();
      } else {
        this.favouriteItems.next([]);
      }
    });
  }

  private loadFavourites(): void {
    // Only load if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.favouriteItems.next([]);
      return;
    }
    
    const storedItems = localStorage.getItem(this.storageName);
    if (storedItems) {
      try {
        const items = JSON.parse(storedItems);
        this.favouriteItems.next(items);
      } catch (error) {
        console.error('Error parsing favourites from localStorage', error);
        // Reset localStorage if there's an error
        localStorage.removeItem(this.storageName);
      }
    }
  }

  private saveFavourites(items: Product[]): void {
    // Only save if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    localStorage.setItem(this.storageName, JSON.stringify(items));
    this.favouriteItems.next(items);
  }

  getFavouriteItems(): Observable<Product[]> {
    // Only return items if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return of([]);
    }
    return this.favouriteItems.asObservable();
  }

  getFavouriteItemsCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getFavouriteItems().subscribe(items => {
        observer.next(items.length);
      });
    });
  }

  isInFavourites(productId: string): boolean {
    // If not authenticated, nothing is in favorites
    if (!this.authService.isAuthenticated()) {
      return false;
    }
    const items = this.favouriteItems.getValue();
    return items.some(item => item.id === productId);
  }

  addToFavourites(product: Product): void {
    // Only add if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    const currentItems = this.favouriteItems.getValue();
    
    // Check if product is already in favourites
    if (!this.isInFavourites(product.id)) {
      const updatedItems = [...currentItems, product];
      this.saveFavourites(updatedItems);
    }
  }

  removeFromFavourites(productId: string): void {
    // Only remove if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    const currentItems = this.favouriteItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.saveFavourites(updatedItems);
  }

  toggleFavouriteItem(product: Product): void {
    // Only toggle if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return;
    }
    
    if (this.isInFavourites(product.id)) {
      this.removeFromFavourites(product.id);
    } else {
      this.addToFavourites(product);
    }
  }

  clearFavourites(): void {
    localStorage.removeItem(this.storageName);
    this.favouriteItems.next([]);
  }
} 