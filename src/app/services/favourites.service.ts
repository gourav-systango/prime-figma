import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private favouriteItems = new BehaviorSubject<Product[]>([]);
  private storageName = 'favourite_items';

  constructor() {
    // Load favourites from localStorage on service initialization
    this.loadFavourites();
  }

  private loadFavourites(): void {
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
    localStorage.setItem(this.storageName, JSON.stringify(items));
    this.favouriteItems.next(items);
  }

  getFavouriteItems(): Observable<Product[]> {
    return this.favouriteItems.asObservable();
  }

  getFavouriteItemsCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.favouriteItems.subscribe(items => {
        observer.next(items.length);
      });
    });
  }

  isInFavourites(productId: string): boolean {
    const items = this.favouriteItems.getValue();
    return items.some(item => item.id === productId);
  }

  addToFavourites(product: Product): void {
    const currentItems = this.favouriteItems.getValue();
    
    // Check if product is already in favourites
    if (!this.isInFavourites(product.id)) {
      const updatedItems = [...currentItems, product];
      this.saveFavourites(updatedItems);
    }
  }

  removeFromFavourites(productId: string): void {
    const currentItems = this.favouriteItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.saveFavourites(updatedItems);
  }

  toggleFavouriteItem(product: Product): void {
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