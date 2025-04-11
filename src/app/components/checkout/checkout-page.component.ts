import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../services/cart.service';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout-page.component.html',
  styles: []
})
export class CheckoutPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  shippingCost: number = 0;
  tax: number = 0;
  
  currentStep: number = 1;
  checkoutForm!: FormGroup;
  submitted: boolean = false;
  orderCompleted: boolean = false;
  orderId: string = '';
  
  paymentMethods: PaymentMethod[] = [
    { id: 'credit_card', name: 'Credit Card', icon: 'pi pi-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'pi pi-paypal' },
    { id: 'bank', name: 'Bank Transfer', icon: 'pi pi-wallet' }
  ];
  
  selectedPaymentMethod: string = 'credit_card';

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
    
    this.initForm();
  }
  
  private initForm(): void {
    this.checkoutForm = this.formBuilder.group({
      // Billing information
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      
      // Shipping address
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      
      // Payment information
      cardNumber: ['', [Validators.required]],
      cardholderName: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
      
      saveInfo: [false]
    });
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      // Validate billing info fields
      this.submitted = true;
      
      if (this.checkoutForm.get('fullName')?.valid &&
          this.checkoutForm.get('email')?.valid &&
          this.checkoutForm.get('phone')?.valid &&
          this.checkoutForm.get('address')?.valid &&
          this.checkoutForm.get('city')?.valid &&
          this.checkoutForm.get('state')?.valid &&
          this.checkoutForm.get('zipCode')?.valid &&
          this.checkoutForm.get('country')?.valid) {
        this.currentStep = 2;
        this.submitted = false;
      }
    } else if (this.currentStep === 2) {
      // Validate payment fields
      this.submitted = true;
      
      if (this.selectedPaymentMethod === 'credit_card') {
        if (this.checkoutForm.get('cardNumber')?.valid &&
            this.checkoutForm.get('cardholderName')?.valid &&
            this.checkoutForm.get('expiryDate')?.valid &&
            this.checkoutForm.get('cvv')?.valid) {
          this.currentStep = 3;
          this.submitted = false;
        }
      } else {
        // For other payment methods assume valid for this demo
        this.currentStep = 3;
        this.submitted = false;
      }
    }
  }
  
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.submitted = false;
    }
  }
  
  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }
  
  placeOrder(): void {
    // Generate a random order number
    this.orderId = 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Show order confirmation
    this.orderCompleted = true;
    
    // Clear cart after successful order
    setTimeout(() => {
      this.cartService.clearCart();
    }, 1000);
  }
  
  private calculateTotals(): void {
    // Calculate subtotal
    this.cartTotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate shipping (free over $100)
    this.shippingCost = this.cartTotal >= 100 ? 0 : 10;
    
    // Calculate tax (10%)
    this.tax = this.cartTotal * 0.1;
  }
  
  getOrderTotal(): number {
    return this.cartTotal + this.shippingCost + this.tax;
  }
  
  continueToHome(): void {
    this.router.navigate(['/']);
  }

  // Helper methods to get payment method details
  getPaymentMethodName(): string {
    const method = this.paymentMethods.find(m => m.id === this.selectedPaymentMethod);
    return method ? method.name : '';
  }

  getPaymentMethodIcon(): string {
    const method = this.paymentMethods.find(m => m.id === this.selectedPaymentMethod);
    return method ? method.icon : '';
  }

  getLastFourDigits(): string {
    const cardNumber = this.checkoutForm.get('cardNumber')?.value;
    if (cardNumber && cardNumber.length >= 4) {
      return cardNumber.slice(-4);
    }
    return '****';
  }
} 