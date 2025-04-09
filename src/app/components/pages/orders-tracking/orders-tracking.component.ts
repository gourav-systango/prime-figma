import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-tracking.component.html',
  styleUrls: ['./orders-tracking.component.scss']
})
export class OrdersTrackingComponent {
  trackingId: string = '';
  
  trackOrder(): void {
    // Tracking logic would be implemented here
    console.log('Tracking order with ID:', this.trackingId);
    alert('Order tracking feature coming soon!');
  }
} 