import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing/landing-page/landing-page.component';
import { CataloguePageComponent } from './components/catalogue/catalogue-page.component';
import { FashionPageComponent } from './components/fashion/fashion-page.component';
import { LifestyleComponent } from './components/lifestyle/lifestyle.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { AuthGuardService } from './services/auth-guard.service';

// Import footer page components
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { OrdersComponent } from './components/pages/profile/orders/orders.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'catalogue', component: CataloguePageComponent },
  { path: 'catalogue/:category', component: CataloguePageComponent },
  { path: 'product/:id', loadComponent: () => import('./components/catalogue/product-detail/product-detail.component').then(c => c.ProductDetailComponent) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart-page.component').then(c => c.CartPageComponent) },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout-page.component').then(c => c.CheckoutPageComponent) },
  { path: 'fashion', component: FashionPageComponent },
  { path: 'lifestyle', component: LifestyleComponent },
  { 
    path: 'favourite', 
    component: FavouriteComponent,
    canActivate: [AuthGuardService]  // Protect this route with auth guard
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuardService]  // Protect this route with auth guard
  },
  {
    path: 'profile/orders',
    component: OrdersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile/settings',
    loadComponent: () => import('./components/pages/profile/settings/settings.component').then(c => c.SettingsComponent),
    canActivate: [AuthGuardService]
  },
  
  // Authentication routes
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'signin', redirectTo: '', pathMatch: 'full' },
  { path: 'signup', redirectTo: '', pathMatch: 'full' },
  
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
