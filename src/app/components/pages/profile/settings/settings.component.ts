import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface UserSettings {
  email: string;
  name: string;
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsAndBlog: boolean;
  };
  preferences: {
    language: string;
    currency: string;
  };
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  userSettings: UserSettings = {
    email: 'user@example.com',
    name: 'John Doe',
    notifications: {
      orderUpdates: true,
      promotions: false,
      newsAndBlog: true
    },
    preferences: {
      language: 'English',
      currency: 'USD'
    }
  };
  
  languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' }
  ];
  
  currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' }
  ];
  
  saveSettings(): void {
    // Would save to a service in a real app
    console.log('Saving settings:', this.userSettings);
    alert('Settings saved successfully!');
  }
} 