import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  supportCategories = [
    {
      title: 'Orders & Shipping',
      icon: 'box',
      items: ['Order Status', 'Shipping Options', 'Delivery Timeframes', 'International Orders']
    },
    {
      title: 'Returns & Refunds',
      icon: 'refresh',
      items: ['Return Policy', 'How to Return', 'Refund Process', 'Exchanges']
    },
    {
      title: 'Payment & Billing',
      icon: 'card',
      items: ['Payment Methods', 'Gift Cards', 'Billing Issues', 'Promotions & Discounts']
    }
  ];
} 