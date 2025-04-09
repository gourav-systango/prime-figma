import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

interface NewsletterForm {
  email: string;
}

@Component({
  selector: 'app-newsletter-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './newsletter-section.component.html',
  styleUrls: ['./newsletter-section.component.scss']
})
export class NewsletterSectionComponent {
  newsletterForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  onSubmit(): void {
    if (this.newsletterForm.valid) {
      // Here you would typically call a service to send the email
      console.log('Submitting email:', this.newsletterForm.value.email);
      // Reset the form after submission
      this.newsletterForm.reset();
    }
  }
}
