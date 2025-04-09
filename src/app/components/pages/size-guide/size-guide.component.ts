import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SizeTable {
  type: string;
  headers: string[];
  sizes: {
    label: string;
    measurements: string[];
  }[];
}

@Component({
  selector: 'app-size-guide',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './size-guide.component.html',
  styleUrls: ['./size-guide.component.scss']
})
export class SizeGuideComponent {
  activeCategory: string = 'women';

  womenSizes: SizeTable = {
    type: 'women',
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'],
    sizes: [
      { label: 'XS', measurements: ['31-32', '24-25', '34-35'] },
      { label: 'S', measurements: ['33-34', '26-27', '36-37'] },
      { label: 'M', measurements: ['35-36', '28-29', '38-39'] },
      { label: 'L', measurements: ['37-39', '30-32', '40-42'] },
      { label: 'XL', measurements: ['40-42', '33-35', '43-45'] }
    ]
  };

  menSizes: SizeTable = {
    type: 'men',
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
    sizes: [
      { label: 'XS', measurements: ['34-36', '28-30', '34-36'] },
      { label: 'S', measurements: ['36-38', '30-32', '36-38'] },
      { label: 'M', measurements: ['38-40', '32-34', '38-40'] },
      { label: 'L', measurements: ['40-42', '34-36', '40-42'] },
      { label: 'XL', measurements: ['42-44', '36-38', '42-44'] }
    ]
  };

  kidsSizes: SizeTable = {
    type: 'kids',
    headers: ['Size', 'Height (in)', 'Chest (in)', 'Waist (in)'],
    sizes: [
      { label: '2T', measurements: ['33-35', '21', '20'] },
      { label: '3T', measurements: ['36-38', '22', '20.5'] },
      { label: '4T', measurements: ['39-41', '23', '21'] },
      { label: '5', measurements: ['42-44', '24', '21.5'] },
      { label: '6', measurements: ['45-47', '25', '22'] }
    ]
  };

  changeCategory(category: string): void {
    this.activeCategory = category;
  }

  get activeTable(): SizeTable {
    if (this.activeCategory === 'men') return this.menSizes;
    if (this.activeCategory === 'kids') return this.kidsSizes;
    return this.womenSizes;
  }
} 