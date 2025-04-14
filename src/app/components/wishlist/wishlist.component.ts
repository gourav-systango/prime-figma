import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { FavouritesService } from '../../services/favourites.service';
import { Product } from '../../interfaces/product.interface';
import { CartService } from '../../services/cart.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule],
  templateUrl: './wishlist.component.html',
  providers: [MessageService],
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private favouritesService: FavouritesService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  loadWishlistItems(): void {
    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistItems = items;
    });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
    this.messageService.add({
      severity: 'success',
      summary: 'Removed from Wishlist',
      detail: 'Item has been removed from your wishlist'
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${product.name} has been added to your cart`
    });
  }

  addToFavourites(product: Product): void {
    this.favouritesService.addToFavourites(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Favourites',
      detail: `${product.name} has been added to your personal favourites.`
    });
  }

  getDiscountPercentage(product: Product): number {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }
} 