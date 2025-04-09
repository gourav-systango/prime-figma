import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  contactInfo = [
    {
      icon: 'location',
      title: 'Our Location',
      details: '123 Fashion Street, Design District, New York, NY 10001, USA'
    },
    {
      icon: 'phone',
      title: 'Phone Number',
      details: '+1 (555) 123-4567'
    },
    {
      icon: 'email',
      title: 'Email Address',
      details: 'contact@fashion.com'
    },
    {
      icon: 'clock',
      title: 'Working Hours',
      details: 'Mon - Fri: 9:00 AM - 6:00 PM EST'
    }
  ];

  submitForm() {
    // This would typically contain API call logic
    console.log('Form submitted:', this.contactForm);
    alert('Thank you for your message! We will get back to you shortly.');
    
    // Reset form
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
} 