import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  date: Date;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  
  constructor() {}
  
  ngOnInit(): void {
    // In a real application, this would come from a service
    this.orders = this.getMockOrders();
  }
  
  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }
  
  closeOrderDetails(): void {
    this.selectedOrder = null;
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  getOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Mock data for development
  private getMockOrders(): Order[] {
    return [
      {
        id: 'ORD-2023-001',
        date: new Date(2023, 9, 15),
        status: 'delivered',
        items: [
          {
            id: 'ITEM001',
            name: 'Premium Cotton T-Shirt',
            price: 29.99,
            quantity: 2,
            imageUrl: 'images/catalogue/tshirt.jpg',
            size: 'M',
            color: 'Black'
          },
          {
            id: 'ITEM002',
            name: 'Slim Fit Jeans',
            price: 49.99,
            quantity: 1,
            imageUrl: 'images/catalogue/jeans.jpg',
            size: '32',
            color: 'Blue'
          }
        ],
        total: 109.97,
        trackingNumber: 'TRK12345678',
        shippingAddress: {
          street: '123 Fashion St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        }
      },
      {
        id: 'ORD-2023-002',
        date: new Date(2023, 10, 5),
        status: 'shipped',
        items: [
          {
            id: 'ITEM003',
            name: 'Wool Blend Coat',
            price: 129.99,
            quantity: 1,
            imageUrl: 'images/catalogue/coat.jpg',
            size: 'L',
            color: 'Grey'
          }
        ],
        total: 129.99,
        trackingNumber: 'TRK87654321',
        shippingAddress: {
          street: '456 Style Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          country: 'USA'
        }
      },
      {
        id: 'ORD-2023-003',
        date: new Date(2023, 11, 1),
        status: 'processing',
        items: [
          {
            id: 'ITEM004',
            name: 'Leather Sneakers',
            price: 89.99,
            quantity: 1,
            imageUrl: 'images/catalogue/sneakers.jpg',
            size: '43',
            color: 'White'
          },
          {
            id: 'ITEM005',
            name: 'Canvas Backpack',
            price: 59.99,
            quantity: 1,
            imageUrl: 'images/catalogue/backpack.jpg',
            color: 'Navy'
          }
        ],
        total: 149.98,
        shippingAddress: {
          street: '789 Trend Blvd',
          city: 'Chicago',
          state: 'IL',
          zip: '60007',
          country: 'USA'
        }
      }
    ];
  }
} 