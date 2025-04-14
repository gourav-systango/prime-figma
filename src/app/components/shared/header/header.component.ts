import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthModalService } from '../../../services/auth-modal.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { FavouritesService } from '../../../services/favourites.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    AuthModalComponent,
    OverlayPanelModule,
    ButtonModule,
    AvatarModule,
    BadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false;
  cartItemCount = 0;
  wishlistItemCount = 0;
  favouriteItemCount = 0;
  
  constructor(
    public authModalService: AuthModalService,
    public authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private favouritesService: FavouritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItemsCount().subscribe(count => {
      this.cartItemCount = count;
    });
    
    this.wishlistService.getWishlistItemsCount().subscribe(count => {
      this.wishlistItemCount = count;
    });
    
    this.favouritesService.getFavouriteItemsCount().subscribe(count => {
      this.favouriteItemCount = count;
    });
  }

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
    this.router.navigate(['/']);
  }
  
  getUserAvatar(): string {
    const user = this.authService.getCurrentUser();
    return user?.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User');
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
  
  navigateToWishlist(): void {
    this.router.navigate(['/wishlist']);
    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
  
  navigateToFavourites(): void {
    this.router.navigate(['/favourite']);
    // Close mobile menu if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
}
