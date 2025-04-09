import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Sarah Johnson',
      position: 'Creative Director',
      imageUrl: 'images/about/team1.jpg',
      bio: 'Sarah brings over 15 years of experience in fashion design and creative direction, having worked with some of the most prestigious brands in the industry.'
    },
    {
      name: 'Michael Chen',
      position: 'Head of Design',
      imageUrl: 'images/about/team2.jpg',
      bio: 'With a background in sustainable design, Michael leads our design team with a focus on creating timeless pieces that minimize environmental impact.'
    },
    {
      name: 'Priya Sharma',
      position: 'Product Manager',
      imageUrl: 'images/about/team3.jpg',
      bio: 'Priya oversees our product development process, ensuring each item meets our high standards for quality, sustainability, and style.'
    },
    {
      name: 'James Wilson',
      position: 'CEO',
      imageUrl: 'images/about/team4.jpg',
      bio: 'As our founder and CEO, James established FASHION with a vision to create accessible, high-quality fashion that empowers individuals to express themselves.'
    }
  ];

  milestones = [
    {
      year: '2018',
      title: 'Our Beginning',
      description: 'FASHION was founded with a vision to redefine the online shopping experience.'
    },
    {
      year: '2019',
      title: 'Global Expansion',
      description: 'We expanded our operations to serve customers in over 20 countries worldwide.'
    },
    {
      year: '2020',
      title: 'Sustainability Initiative',
      description: 'Launched our first sustainable collection made from 100% recycled materials.'
    },
    {
      year: '2022',
      title: 'Design Innovation',
      description: 'Introduced our state-of-the-art design studio and collaborative platform.'
    },
    {
      year: '2023',
      title: 'Community Growth',
      description: 'Reached 1 million active customers and launched our community engagement program.'
    }
  ];
} 