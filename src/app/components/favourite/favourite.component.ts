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
  selector: 'app-favourite',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule],
  templateUrl: './favourite.component.html',
  providers: [MessageService],
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {
  favouriteItems: Product[] = [];

  constructor(
    private favouritesService: FavouritesService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadFavouriteItems();
  }

  loadFavouriteItems(): void {
    this.favouritesService.getFavouriteItems().subscribe(items => {
      this.favouriteItems = items;
    });
  }

  removeFromFavourites(productId: string): void {
    this.favouritesService.removeFromFavourites(productId);
    this.messageService.add({
      severity: 'success',
      summary: 'Removed from Favourites',
      detail: 'Item has been removed from your favourites'
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

  addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Wishlist',
      detail: `${product.name} has been added to your wishlist for later purchase.`
    });
  }

  getDiscountPercentage(product: Product): number {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }
} 