export interface ProductCategory {
  id: string;
  title: string;
  imagePath: string;
  exploreLink: string;
}

export interface Brand {
  id: string;
  name: string;
  imagePath: string;
  link: string;
}

export interface SocialMedia {
  id: string;
  name: string;
  icon: string;
  link: string;
}

export interface FooterLink {
  id: string;
  text: string;
  link: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
} 