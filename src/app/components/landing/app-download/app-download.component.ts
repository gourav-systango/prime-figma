import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StoreLink {
  platform: string;
  url: string;
  imageSrc: string;
  altText: string;
}

@Component({
  selector: 'app-app-download',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-download.component.html',
  styleUrls: ['./app-download.component.scss']
})
export class AppDownloadComponent {
  storeLinks: StoreLink[] = [
    {
      platform: 'ios',
      url: '#',
      imageSrc: 'images/app-store.png',
      altText: 'Download on App Store'
    },
    {
      platform: 'android',
      url: '#',
      imageSrc: 'images/google-play.png',
      altText: 'Get it on Google Play'
    }
  ];
}
