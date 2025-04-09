import { Component } from '@angular/core';
import { FooterSection, SocialMedia } from '../../../interfaces/shopping.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  socialMedia: SocialMedia[] = [
    { id: '1', name: 'Facebook', icon: 'images/facebook.svg', link: '#' },
    { id: '2', name: 'Twitter', icon: 'images/twitter.svg', link: '#' },
    { id: '3', name: 'Instagram', icon: 'images/instagram.svg', link: '#' },
    { id: '4', name: 'LinkedIn', icon: 'in', link: '#' }
  ];

  footerSections: FooterSection[] = [
    {
      id: '1',
      title: 'Company',
      links: [
        { id: '1', text: 'About', link: '/about' },
        { id: '2', text: 'Contact us', link: '/contact' },
        { id: '3', text: 'Support', link: '/support' },
        { id: '4', text: 'Careers', link: '/careers' }
      ]
    },
    {
      id: '2',
      title: 'Quick Link',
      links: [
        { id: '1', text: 'Share Location', link: '/share-location' },
        { id: '2', text: 'Orders Tracking', link: '/order-tracking' },
        { id: '3', text: 'Size Guide', link: '/size-guide' },
        { id: '4', text: 'FAQs', link: '/faq' }
      ]
    },
    {
      id: '3',
      title: 'Legal',
      links: [
        { id: '1', text: 'Privacy Policy', link: '/privacy-policy' },
        { id: '2', text: 'Terms & conditions', link: '/terms' }
      ]
    }
  ];
}
