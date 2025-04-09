import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent {
  jobListings: JobListing[] = [
    {
      id: 'job-001',
      title: 'Senior Fashion Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time'
    },
    {
      id: 'job-002',
      title: 'Front-End Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      id: 'job-003',
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Full-time'
    },
    {
      id: 'job-004',
      title: 'Customer Support Representative',
      department: 'Customer Service',
      location: 'Remote',
      type: 'Part-time'
    }
  ];
} 