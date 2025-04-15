import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProductComment, ProductCommentReply } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private mockComments: { [productId: string]: ProductComment[] } = {
    'product-1': [
      {
        id: 'comment-1',
        productId: 'product-1',
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 4,
        comment: 'Great product, exactly as described. The fabric is high quality and the design is perfect.',
        date: new Date('2023-09-15'),
        isVerifiedPurchase: true,
        helpful: 12,
        imageAttachments: ['https://picsum.photos/id/237/800/600'],
        replies: [
          {
            id: 'reply-1',
            commentId: 'comment-1',
            userId: 'admin-1',
            userName: 'Store Admin',
            userAvatar: 'https://randomuser.me/api/portraits/men/18.jpg',
            reply: "Thank you for your feedback! We're glad you enjoyed the product.",
            date: new Date('2023-09-16'),
            isAdmin: true
          }
        ]
      },
      {
        id: 'comment-2',
        productId: 'product-1',
        userId: 'user-2',
        userName: 'Jane Smith',
        userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        rating: 5,
        comment: 'Absolutely love this! The quality exceeded my expectations and shipping was fast.',
        date: new Date('2023-09-10'),
        isVerifiedPurchase: true,
        helpful: 8,
        imageAttachments: ['https://picsum.photos/id/26/800/600', 'https://picsum.photos/id/62/800/600']
      },
      {
        id: 'comment-3',
        productId: 'product-1',
        userId: 'user-3',
        userName: 'Michael Johnson',
        userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        rating: 3,
        comment: 'Good product but slightly different color than shown in pictures.',
        date: new Date('2023-08-29'),
        isVerifiedPurchase: true,
        helpful: 5
      }
    ]
  };

  constructor() { }

  getCommentsByProductId(productId: string): Observable<ProductComment[]> {
    // Simulate network delay
    return of(this.mockComments[productId] || []).pipe(
      delay(800)
    );
  }

  addComment(comment: Omit<ProductComment, 'id' | 'date' | 'helpful'>): Observable<ProductComment> {
    const newComment: ProductComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      date: new Date(),
      helpful: 0
    };

    if (!this.mockComments[comment.productId]) {
      this.mockComments[comment.productId] = [];
    }
    this.mockComments[comment.productId].push(newComment);
    
    // Simulate network delay
    return of(newComment).pipe(
      delay(800)
    );
  }

  addReply(commentId: string, productId: string, reply: Omit<ProductCommentReply, 'id' | 'date'>): Observable<ProductCommentReply> {
    const newReply: ProductCommentReply = {
      ...reply,
      id: `reply-${Date.now()}`,
      date: new Date()
    };

    const comments = this.mockComments[productId];
    if (comments) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(newReply);
      }
    }
    
    // Simulate network delay
    return of(newReply).pipe(
      delay(800)
    );
  }

  markHelpful(commentId: string, productId: string): Observable<boolean> {
    const comments = this.mockComments[productId];
    if (comments) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.helpful += 1;
        return of(true).pipe(delay(500));
      }
    }
    return of(false).pipe(delay(500));
  }

  // This would be a real file upload in a production app
  uploadImage(file: File): Observable<string> {
    // Simulate network delay and return a placeholder URL
    console.log('Uploading image:', file.name);
    
    // Generate random ID for the image
    const randomId = Math.floor(Math.random() * 1000);
    
    // Use public placeholder image services instead of local assets
    const mockImageUrl = `https://picsum.photos/id/${randomId}/800/600`;
    
    return of(mockImageUrl).pipe(
      delay(1200)
    );
  }
} 