import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { FavouritesService } from '../../../services/favourites.service';
import { AuthService } from '../../../services/auth.service';
import { AuthModalService } from '../../../services/auth-modal.service';
import { Product } from '../../../interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { CommentService } from '../../../services/comment.service';
import { ProductComment, ProductCommentReply } from '../../../interfaces/product.interface';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextarea } from 'primeng/inputtextarea';
import { Avatar } from 'primeng/avatar';
import { TabView, TabPanel } from 'primeng/tabview';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { GalleriaModule as CommentGalleriaModule } from 'primeng/galleria';
import { ProgressBarModule } from 'primeng/progressbar';
import { forkJoin, Observable, of } from 'rxjs';

interface ProductImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    RatingModule, 
    FormsModule, 
    ToastModule, 
    ConfirmDialogModule,
    GalleriaModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextarea,
    Avatar,
    TabView,
    TabPanel,
    ProgressSpinner,
    FileUploadModule,
    ImageModule,
    CommentGalleriaModule,
    ProgressBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-detail.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: Product;
  quantity: number = 1;
  selectedColor?: string;
  selectedSize?: string;
  isInWishlist: boolean = false;
  isInFavourites: boolean = false;
  
  // Galleria configuration
  images: ProductImage[] = [];
  activeIndex: number = 0;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 2
    }
  ];
  
  // Add zoom functionality properties
  zoomVisible: boolean = false;
  zoomImage: string = '';
  zoomLevel: number = 1;
  zoomMax: number = 3;
  zoomMin: number = 0.5;
  zoomStep: number = 0.1;
  // Add pan functionality properties
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  translateX: number = 0;
  translateY: number = 0;
  
  // Comment section properties
  comments: ProductComment[] = [];
  isLoadingComments: boolean = false;
  newCommentForm: FormGroup;
  replyForm: FormGroup;
  activeReplyCommentId: string | null = null;
  
  // Image upload properties
  selectedCommentFiles: File[] = [];
  selectedReplyFiles: File[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;
  
  // Image URL cache for preview
  filePreviewUrls: Map<File, string> = new Map();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private favouritesService: FavouritesService,
    private authService: AuthService,
    private authModalService: AuthModalService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {
    // Initialize the comment form
    this.newCommentForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
    
    // Initialize the reply form
    this.replyForm = this.fb.group({
      reply: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
        this.loadComments(productId);
      }
    });
  }
  
  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      if (product) {
        if (product.colors && product.colors.length > 0) {
          this.selectedColor = product.colors[0];
        }
        // Note: We're no longer auto-selecting the size
        this.isInWishlist = this.wishlistService.isInWishlist(product.id);
        this.isInFavourites = this.favouritesService.isInFavourites(product.id);
        
        // Process images for the galleria
        this.processProductImages(product);
      }
    });
  }
  
  processProductImages(product: Product): void {
    // Reset the images array
    this.images = [];
    
    // Add the main image first
    if (product.imageUrl) {
      this.images.push({
        itemImageSrc: product.imageUrl,
        thumbnailImageSrc: product.imageUrl,
        alt: product.name,
        title: product.name
      });
    }
    
    // Add additional images if available
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        this.images.push({
          itemImageSrc: img,
          thumbnailImageSrc: img,
          alt: product.name,
          title: product.name
        });
      });
    }
    
    // If no images provided, add placeholder images
    if (this.images.length === 0) {
      // Add a default placeholder image
      this.images.push({
        itemImageSrc: 'assets/images/placeholder.jpg',
        thumbnailImageSrc: 'assets/images/placeholder.jpg',
        alt: 'Placeholder',
        title: 'Placeholder'
      });
    }
  }
  
  selectColor(color: string): void {
    this.selectedColor = color;
  }
  
  selectSize(size: string): void {
    this.selectedSize = size;
  }
  
  increaseQuantity(): void {
    this.quantity++;
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  getDiscountPercentage(product: Product): number {
    if (product.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }
  
  validateSelection(): boolean {
    if (!this.product) return false;
    
    let isValid = true;
    const errorMessages = [];
    
    // Check if size selection is required and made
    if (this.product.sizes && this.product.sizes.length > 0 && !this.selectedSize) {
      isValid = false;
      errorMessages.push('Please select a size');
    }
    
    // Check if color selection is required and made
    if (this.product.colors && this.product.colors.length > 0 && !this.selectedColor) {
      isValid = false;
      errorMessages.push('Please select a color');
    }
    
    if (!isValid) {
      // Display error message
      this.messageService.add({
        severity: 'warn',
        summary: 'Selection Required',
        detail: errorMessages.join(', ')
      });
    }
    
    return isValid;
  }
  
  addToCart(): void {
    if (!this.product) return;
    
    // Validate required selections
    if (!this.validateSelection()) {
      return;
    }
    
    this.cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
    this.messageService.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${this.product.name} has been added to your cart.`
    });
  }
  
  confirmAddToCart(): void {
    if (!this.product) return;
    
    // Validate required selections
    if (!this.validateSelection()) {
      return;
    }
    
    // Show confirmation dialog
    this.confirmationService.confirm({
      message: `Add ${this.quantity} ${this.product.name} to your cart?` + 
               (this.selectedSize ? ` (Size: ${this.selectedSize})` : '') + 
               (this.selectedColor ? ` (Color: ${this.selectedColor})` : ''),
      header: 'Confirm Add to Cart',
      icon: 'pi pi-shopping-cart',
      accept: () => {
        this.addToCart();
      }
    });
  }
  
  buyNow(): void {
    if (!this.product) return;
    
    // Validate required selections
    if (!this.validateSelection()) {
      return;
    }
    
    // First add the product to cart
    this.cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
    
    // Show a brief confirmation message
    this.messageService.add({
      severity: 'success',
      summary: 'Processing',
      detail: 'Taking you to checkout...'
    });
    
    // Navigate to checkout page
    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 500);
  }
  
  confirmBuyNow(): void {
    if (!this.product) return;
    
    // Validate required selections
    if (!this.validateSelection()) {
      return;
    }
    
    // Show confirmation dialog
    this.confirmationService.confirm({
      message: `Buy ${this.quantity} ${this.product.name} now?` + 
               (this.selectedSize ? ` (Size: ${this.selectedSize})` : '') + 
               (this.selectedColor ? ` (Color: ${this.selectedColor})` : ''),
      header: 'Confirm Purchase',
      icon: 'pi pi-credit-card',
      accept: () => {
        this.buyNow();
      }
    });
  }
  
  toggleWishlist(): void {
    if (!this.product) return;
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to save items to your wishlist'
      });
      return;
    }
    
    this.wishlistService.toggleWishlistItem(this.product);
    this.isInWishlist = !this.isInWishlist;
    
    this.messageService.add({
      severity: this.isInWishlist ? 'success' : 'info',
      summary: this.isInWishlist ? 'Added to Wishlist' : 'Removed from Wishlist',
      detail: this.isInWishlist ? 
        `${this.product.name} has been added to your wishlist for later purchase.` : 
        `${this.product.name} has been removed from your wishlist.`
    });
  }
  
  toggleFavourites(): void {
    if (!this.product) return;
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to add items to your favourites'
      });
      return;
    }
    
    this.favouritesService.toggleFavouriteItem(this.product);
    this.isInFavourites = !this.isInFavourites;
    
    this.messageService.add({
      severity: this.isInFavourites ? 'success' : 'info',
      summary: this.isInFavourites ? 'Added to Favourites' : 'Removed from Favourites',
      detail: this.isInFavourites ? 
        `${this.product.name} has been added to your favourites.` : 
        `${this.product.name} has been removed from your favourites.`
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  /**
   * Opens the zoom modal with the selected image
   * @param imageSrc Source of the image to zoom
   */
  openZoom(imageSrc: string): void {
    this.zoomImage = imageSrc;
    this.zoomLevel = 1; // Reset zoom level
    this.resetPan(); // Reset pan position
    this.zoomVisible = true;
  }
  
  /**
   * Closes the zoom modal
   */
  closeZoom(): void {
    this.zoomVisible = false;
    this.zoomLevel = 1; // Reset zoom level
    this.resetPan(); // Reset pan position
  }
  
  /**
   * Increases the zoom level of the current image
   */
  zoomIn(): void {
    if (this.zoomLevel < this.zoomMax) {
      this.zoomLevel += this.zoomStep;
    }
  }
  
  /**
   * Decreases the zoom level of the current image
   */
  zoomOut(): void {
    if (this.zoomLevel > this.zoomMin) {
      this.zoomLevel -= this.zoomStep;
      
      // If we zoom out to a level close to 1, reset the pan
      if (this.zoomLevel <= 1.1) {
        this.resetPan();
      }
    }
  }
  
  /**
   * Resets the zoom level to default (1)
   */
  resetZoom(): void {
    this.zoomLevel = 1;
    this.resetPan();
  }
  
  /**
   * Resets the pan position
   */
  resetPan(): void {
    this.translateX = 0;
    this.translateY = 0;
  }
  
  /**
   * Starts dragging the zoomed image
   * @param event Mouse or touch event
   */
  startDrag(event: MouseEvent | TouchEvent): void {
    // Only enable dragging when zoomed in
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      
      if (event instanceof MouseEvent) {
        this.startX = event.clientX;
        this.startY = event.clientY;
      } else {
        // TouchEvent
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
      }
    }
  }
  
  /**
   * Drags the zoomed image
   * @param event Mouse or touch event
   */
  doDrag(event: MouseEvent | TouchEvent): void {
    if (this.isDragging && this.zoomLevel > 1) {
      let currentX: number;
      let currentY: number;
      
      if (event instanceof MouseEvent) {
        currentX = event.clientX;
        currentY = event.clientY;
      } else {
        // TouchEvent
        currentX = event.touches[0].clientX;
        currentY = event.touches[0].clientY;
      }
      
      const deltaX = currentX - this.startX;
      const deltaY = currentY - this.startY;
      
      this.translateX += deltaX;
      this.translateY += deltaY;
      
      this.startX = currentX;
      this.startY = currentY;
      
      // Prevent event from propagating
      event.preventDefault();
    }
  }
  
  /**
   * Stops dragging the zoomed image
   */
  endDrag(): void {
    this.isDragging = false;
  }
  
  /**
   * Gets the transform style for the zoomed image
   */
  getZoomTransform(): string {
    return `scale(${this.zoomLevel}) translate(${this.translateX}px, ${this.translateY}px)`;
  }

  /**
   * Load comments for the current product
   */
  loadComments(productId: string): void {
    this.isLoadingComments = true;
    this.commentService.getCommentsByProductId(productId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoadingComments = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load product comments'
        });
      }
    });
  }
  
  /**
   * Handle file selection for comment images
   */
  onCommentFileSelect(event: any): void {
    this.selectedCommentFiles = [];
    for (let file of event.files) {
      this.selectedCommentFiles.push(file);
      // Create and store URL for preview
      this.createFilePreviewUrl(file);
    }
  }
  
  /**
   * Handle file selection for reply images
   */
  onReplyFileSelect(event: any): void {
    this.selectedReplyFiles = [];
    for (let file of event.files) {
      this.selectedReplyFiles.push(file);
      // Create and store URL for preview
      this.createFilePreviewUrl(file);
    }
  }
  
  /**
   * Create preview URL for a file
   */
  createFilePreviewUrl(file: File): string {
    if (this.filePreviewUrls.has(file)) {
      return this.filePreviewUrls.get(file) || '';
    }
    
    try {
      const url = URL.createObjectURL(file);
      this.filePreviewUrls.set(file, url);
      return url;
    } catch (error) {
      console.error('Error creating file preview URL:', error);
      return '';
    }
  }
  
  /**
   * Get preview URL for a file
   */
  getFilePreviewUrl(file: File): string {
    const url = this.filePreviewUrls.get(file);
    if (url) {
      return url;
    }
    
    // If URL doesn't exist, create it
    return this.createFilePreviewUrl(file);
  }
  
  /**
   * Remove a selected comment file
   */
  removeCommentFile(index: number): void {
    const file = this.selectedCommentFiles[index];
    this.revokeFilePreviewUrl(file);
    this.selectedCommentFiles.splice(index, 1);
  }
  
  /**
   * Remove a selected reply file
   */
  removeReplyFile(index: number): void {
    const file = this.selectedReplyFiles[index];
    this.revokeFilePreviewUrl(file);
    this.selectedReplyFiles.splice(index, 1);
  }
  
  /**
   * Revoke file preview URL to free memory
   */
  revokeFilePreviewUrl(file: File): void {
    if (this.filePreviewUrls.has(file)) {
      const url = this.filePreviewUrls.get(file);
      if (url) {
        URL.revokeObjectURL(url);
      }
      this.filePreviewUrls.delete(file);
    }
  }
  
  /**
   * Upload multiple images and return array of URLs
   */
  uploadImages(files: File[]): Observable<string[]> {
    if (!files.length) {
      return of([]);
    }
    
    this.isUploading = true;
    this.uploadProgress = 0;
    
    // Create an array of upload observables
    const uploads = files.map(file => this.commentService.uploadImage(file));
    
    // Use forkJoin to wait for all uploads to complete
    return new Observable<string[]>(observer => {
      let completed = 0;
      const totalUploads = uploads.length;
      const urls: string[] = [];
      
      // If no files to upload, return empty array
      if (totalUploads === 0) {
        this.isUploading = false;
        observer.next([]);
        observer.complete();
        return;
      }
      
      // Process each upload
      uploads.forEach((upload, index) => {
        upload.subscribe({
          next: (url) => {
            urls[index] = url;
            completed++;
            this.uploadProgress = Math.round((completed / totalUploads) * 100);
            
            if (completed === totalUploads) {
              this.isUploading = false;
              observer.next(urls);
              observer.complete();
            }
          },
          error: (err) => {
            this.isUploading = false;
            observer.error(err);
          }
        });
      });
    });
  }
  
  /**
   * Submit a new comment
   */
  submitComment(): void {
    if (this.newCommentForm.invalid || !this.product) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to leave a comment'
      });
      return;
    }
    
    // Show loading for image upload
    if (this.selectedCommentFiles.length > 0) {
      this.isUploading = true;
    }
    
    // Upload images first if there are any
    this.uploadImages(this.selectedCommentFiles).subscribe({
      next: (imageUrls) => {
        this.isUploading = false;
        
        const currentUser = this.authService.getCurrentUser();
        // Ensure userId is a string
        const userId: string = String(currentUser?.id || 'guest');
        
        // Set default avatar if none exists
        let userAvatar = currentUser?.profilePicture;
        if (!userAvatar) {
          // Default avatar from randomuser.me
          userAvatar = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
        }
        
        const newComment = {
          productId: this.product!.id,
          userId,
          userName: currentUser?.name || 'Guest User',
          userAvatar,
          rating: this.newCommentForm.value.rating,
          comment: this.newCommentForm.value.comment,
          isVerifiedPurchase: true,
          imageAttachments: imageUrls.length > 0 ? imageUrls : undefined
        };
        
        this.commentService.addComment(newComment).subscribe({
          next: (comment) => {
            this.comments.unshift(comment);
            this.newCommentForm.reset({rating: 5});
            this.selectedCommentFiles = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Comment Posted',
              detail: 'Your review has been successfully posted'
            });
          },
          error: (error) => {
            console.error('Error posting comment:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to post your review'
            });
          }
        });
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Error uploading images:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'Failed to upload images'
        });
      }
    });
  }
  
  /**
   * Open the reply form for a comment
   */
  openReplyForm(commentId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to reply to comments'
      });
      return;
    }
    
    this.activeReplyCommentId = commentId;
    this.replyForm.reset();
  }
  
  /**
   * Cancel the reply form
   */
  cancelReply(): void {
    this.activeReplyCommentId = null;
    this.replyForm.reset();
  }
  
  /**
   * Submit a reply to a comment
   */
  submitReply(commentId: string): void {
    if (this.replyForm.invalid || !this.product) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }
    
    if (!this.authService.isAuthenticated()) {
      this.authModalService.openModal('signin');
      this.messageService.add({
        severity: 'info',
        summary: 'Authentication Required',
        detail: 'Please log in to reply to comments'
      });
      return;
    }
    
    // Show loading for image upload
    if (this.selectedReplyFiles.length > 0) {
      this.isUploading = true;
    }
    
    // Upload images first if there are any
    this.uploadImages(this.selectedReplyFiles).subscribe({
      next: (imageUrls) => {
        this.isUploading = false;
        
        const currentUser = this.authService.getCurrentUser();
        const userId: string = String(currentUser?.id || 'guest');
        
        // Set default avatar if none exists
        let userAvatar = currentUser?.profilePicture;
        if (!userAvatar) {
          // Default avatar from randomuser.me
          userAvatar = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
        }
        
        const newReply = {
          commentId,
          userId,
          userName: currentUser?.name || 'Guest User',
          userAvatar,
          reply: this.replyForm.value.reply,
          isAdmin: currentUser?.role === 'admin',
          imageAttachments: imageUrls.length > 0 ? imageUrls : undefined
        };
        
        this.commentService.addReply(commentId, this.product!.id, newReply).subscribe({
          next: (reply) => {
            // Find the comment and add the reply
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
              if (!comment.replies) {
                comment.replies = [];
              }
              comment.replies.push(reply);
            }
            
            // Reset form and selected files
            this.replyForm.reset();
            this.selectedReplyFiles = [];
            this.activeReplyCommentId = null;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Reply Posted',
              detail: 'Your reply has been successfully posted'
            });
          },
          error: (error) => {
            console.error('Error posting reply:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to post your reply'
            });
          }
        });
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Error uploading images:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'Failed to upload images'
        });
      }
    });
  }
  
  /**
   * Mark a comment as helpful
   */
  markHelpful(commentId: string): void {
    if (!this.product) return;
    
    this.commentService.markHelpful(commentId, this.product.id).subscribe({
      next: (success) => {
        if (success) {
          // Update local comment count
          const comment = this.comments.find(c => c.id === commentId);
          if (comment) {
            comment.helpful += 1;
          }
          
          this.messageService.add({
            severity: 'success',
            summary: 'Marked as Helpful',
            detail: 'Thanks for your feedback!'
          });
        }
      }
    });
  }
  
  /**
   * Format the date for display
   */
  formatDate(date: Date): string {
    if (!date) return '';
    
    // Convert string date to Date object if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Clean up all URLs when component is destroyed
  ngOnDestroy(): void {
    // Revoke all object URLs to prevent memory leaks
    this.filePreviewUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.filePreviewUrls.clear();
  }
} 