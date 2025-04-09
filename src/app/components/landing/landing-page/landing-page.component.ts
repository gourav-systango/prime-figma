import { Component } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { BrandsSectionComponent } from '../brands-section/brands-section.component';
import { ArrivalsSectionComponent } from '../arrivals-section/arrivals-section.component';
import { BannerSectionComponent } from '../banner-section/banner-section.component';
import { YoungFavouritesComponent } from '../young-favourites/young-favourites.component';
import { AppDownloadComponent } from '../app-download/app-download.component';
import { NewsletterSectionComponent } from '../newsletter-section/newsletter-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    BrandsSectionComponent,
    ArrivalsSectionComponent,
    BannerSectionComponent,
    YoungFavouritesComponent,
    AppDownloadComponent,
    NewsletterSectionComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

}
