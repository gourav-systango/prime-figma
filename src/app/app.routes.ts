import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing/landing-page/landing-page.component';
import { CataloguePageComponent } from './components/catalogue/catalogue-page.component';
import { FashionPageComponent } from './components/fashion/fashion-page.component';
import { LifestyleComponent } from './components/lifestyle/lifestyle.component';
import { FavouriteComponent } from './components/favourite/favourite.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'catalogue', component: CataloguePageComponent },
  { path: 'fashion', component: FashionPageComponent },
  { path: 'lifestyle', component: LifestyleComponent },
  { path: 'favourite', component: FavouriteComponent },
    
  { path: '**', redirectTo: '' }
];
