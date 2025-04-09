import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing/landing-page/landing-page.component';
import { CataloguePageComponent } from './components/catalogue/catalogue-page.component';
import { FashionPageComponent } from './components/fashion/fashion-page.component';
import { LifestyleComponent } from './components/lifestyle/lifestyle.component';
import { FavouriteComponent } from './components/favourite/favourite.component';

// Import footer page components
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'catalogue', component: CataloguePageComponent },
  { path: 'fashion', component: FashionPageComponent },
  { path: 'lifestyle', component: LifestyleComponent },
  { path: 'favourite', component: FavouriteComponent },
  
  // Footer page routes
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  
  // Lazy-loaded footer pages
  { 
    path: 'support', 
    loadComponent: () => import('./components/pages/support/support.component').then(c => c.SupportComponent) 
  },
  { 
    path: 'careers', 
    loadComponent: () => import('./components/pages/careers/careers.component').then(c => c.CareersComponent) 
  },
  { 
    path: 'share-location', 
    loadComponent: () => import('./components/pages/share-location/share-location.component').then(c => c.ShareLocationComponent) 
  },
  { 
    path: 'orders-tracking', 
    loadComponent: () => import('./components/pages/orders-tracking/orders-tracking.component').then(c => c.OrdersTrackingComponent) 
  },
  { 
    path: 'size-guide', 
    loadComponent: () => import('./components/pages/size-guide/size-guide.component').then(c => c.SizeGuideComponent) 
  },
  { 
    path: 'faqs', 
    loadComponent: () => import('./components/pages/faqs/faqs.component').then(c => c.FaqsComponent) 
  },
  { 
    path: 'privacy-policy', 
    loadComponent: () => import('./components/pages/privacy-policy/privacy-policy.component').then(c => c.PrivacyPolicyComponent) 
  },
  { 
    path: 'terms-conditions', 
    loadComponent: () => import('./components/pages/terms-conditions/terms-conditions.component').then(c => c.TermsConditionsComponent) 
  },
    
  { path: '**', redirectTo: '' }
];
