import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Address {
  id: number;
  type: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface UserAddresses {
  userId: number;
  addresses: Address[];
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  private readonly STORAGE_KEY = 'user_addresses';
  
  addresses$ = this.addressesSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load addresses when service initializes if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadUserAddresses();
    }
    
    // Subscribe to auth state to reload addresses when user logs in/out
    this.authService.authState$.subscribe(state => {
      if (state.isAuthenticated && state.user) {
        this.loadUserAddresses();
      } else {
        this.addressesSubject.next([]);
      }
    });
  }
  
  /**
   * Load addresses for the current user
   */
  loadUserAddresses(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.addressesSubject.next([]);
      return;
    }
    
    // Try to load from local storage first
    const cachedAddresses = this.getCachedAddresses(currentUser.id);
    if (cachedAddresses.length > 0) {
      this.addressesSubject.next(cachedAddresses);
    }
    
    // Then load from the API (which would update the cache)
    this.fetchUserAddresses(currentUser.id).subscribe({
      next: (addresses) => {
        this.addressesSubject.next(addresses);
        this.cacheAddresses(currentUser.id, addresses);
      },
      error: (error) => console.error('Error loading addresses:', error)
    });
  }
  
  /**
   * Fetch addresses from the API for a specific user
   */
  fetchUserAddresses(userId: number): Observable<Address[]> {
    return this.http.get<UserAddresses[]>('mock-data/addresses.json').pipe(
      map(userAddresses => {
        const userAddressData = userAddresses.find(ua => ua.userId === userId);
        return userAddressData?.addresses || [];
      }),
      catchError(error => {
        console.error('Error fetching addresses:', error);
        return of([]);
      })
    );
  }
  
  /**
   * Get a specific address by ID
   */
  getAddressById(addressId: number): Observable<Address | undefined> {
    return this.addresses$.pipe(
      map(addresses => addresses.find(addr => addr.id === addressId))
    );
  }
  
  /**
   * Add a new address for the current user
   */
  addAddress(address: Omit<Address, 'id'>): Observable<Address> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }
    
    // In a real app, this would be an API call
    // For now, we'll simulate adding the address to our local storage
    
    const currentAddresses = this.addressesSubject.value;
    
    // Generate a new ID (would be handled by the server in a real app)
    const newId = currentAddresses.length > 0 
      ? Math.max(...currentAddresses.map(a => a.id)) + 1 
      : 1;
    
    // If this is the first address or explicitly set as default, make it default
    const isDefault = address.isDefault || currentAddresses.length === 0;
    
    // If this address is default, remove default from others
    let updatedAddresses = currentAddresses;
    if (isDefault) {
      updatedAddresses = currentAddresses.map(a => ({
        ...a,
        isDefault: false
      }));
    }
    
    // Create the new address
    const newAddress: Address = {
      ...address as any,
      id: newId,
      isDefault
    };
    
    // Add to the list
    const newAddresses = [...updatedAddresses, newAddress];
    
    // Update state
    this.addressesSubject.next(newAddresses);
    this.cacheAddresses(currentUser.id, newAddresses);
    
    return of(newAddress);
  }
  
  /**
   * Update an existing address
   */
  updateAddress(addressId: number, updates: Partial<Address>): Observable<Address> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }
    
    const currentAddresses = this.addressesSubject.value;
    const addressIndex = currentAddresses.findIndex(a => a.id === addressId);
    
    if (addressIndex === -1) {
      return throwError(() => new Error('Address not found'));
    }
    
    let updatedAddresses = [...currentAddresses];
    
    // If this address is being set as default, remove default from others
    if (updates.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({
        ...a,
        isDefault: false
      }));
    }
    
    // Update the specific address
    const updatedAddress = {
      ...currentAddresses[addressIndex],
      ...updates
    };
    
    updatedAddresses[addressIndex] = updatedAddress;
    
    // Update state
    this.addressesSubject.next(updatedAddresses);
    this.cacheAddresses(currentUser.id, updatedAddresses);
    
    return of(updatedAddress);
  }
  
  /**
   * Delete an address
   */
  deleteAddress(addressId: number): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }
    
    const currentAddresses = this.addressesSubject.value;
    const addressToDelete = currentAddresses.find(a => a.id === addressId);
    
    if (!addressToDelete) {
      return throwError(() => new Error('Address not found'));
    }
    
    const newAddresses = currentAddresses.filter(a => a.id !== addressId);
    
    // If we deleted the default address, make the first one the new default
    if (addressToDelete.isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true;
    }
    
    // Update state
    this.addressesSubject.next(newAddresses);
    this.cacheAddresses(currentUser.id, newAddresses);
    
    return of(true);
  }
  
  /**
   * Set an address as the default
   */
  setDefaultAddress(addressId: number): Observable<Address> {
    return this.updateAddress(addressId, { isDefault: true });
  }
  
  /**
   * Get available address types
   */
  getAddressTypes(): string[] {
    return ['home', 'office', 'friend', 'family', 'other'];
  }
  
  /**
   * Cache addresses in local storage
   */
  private cacheAddresses(userId: number, addresses: Address[]): void {
    try {
      localStorage.setItem(
        `${this.STORAGE_KEY}_${userId}`, 
        JSON.stringify(addresses)
      );
    } catch (error) {
      console.error('Error caching addresses:', error);
    }
  }
  
  /**
   * Get cached addresses from local storage
   */
  private getCachedAddresses(userId: number): Address[] {
    try {
      const cached = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error reading cached addresses:', error);
      return [];
    }
  }
}
