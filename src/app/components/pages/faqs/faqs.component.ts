import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
  category: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent {
  activeCategory: string = 'all';
  
  faqItems: FaqItem[] = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by visiting the Order Tracking page and entering your order number and email address. You will also receive tracking information via email once your order has been shipped.',
      category: 'orders'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all unworn, unwashed items with original tags attached. You can initiate a return through your account or by contacting our customer service team.',
      category: 'returns'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. You can view the specific shipping options during checkout.',
      category: 'shipping'
    },
    {
      question: 'How do I find my size?',
      answer: 'We recommend referring to our detailed Size Guide for accurate measurements. Each product page also includes specific sizing information for that item.',
      category: 'products'
    },
    {
      question: 'Can I change or cancel my order?',
      answer: 'Orders can be modified or canceled within 1 hour of placing them. After this window, please contact our customer service team to see if changes are still possible.',
      category: 'orders'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay.',
      category: 'payment'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days, while express shipping is delivered within 1-2 business days. International orders may take 7-14 days depending on the destination.',
      category: 'shipping'
    },
    {
      question: 'Are your products sustainable?',
      answer: 'We are committed to sustainability and offer a growing collection of eco-friendly products. Look for our "Sustainable Choice" label to identify these items.',
      category: 'products'
    }
  ];

  categories = [
    { id: 'all', name: 'All FAQs' },
    { id: 'orders', name: 'Orders' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'returns', name: 'Returns' },
    { id: 'products', name: 'Products' },
    { id: 'payment', name: 'Payment' }
  ];

  toggleFaq(faq: FaqItem): void {
    faq.isOpen = !faq.isOpen;
  }

  setCategory(category: string): void {
    this.activeCategory = category;
  }

  get filteredFaqs(): FaqItem[] {
    if (this.activeCategory === 'all') {
      return this.faqItems;
    }
    return this.faqItems.filter(item => item.category === this.activeCategory);
  }
} 