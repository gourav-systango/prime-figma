import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoungFavouritesComponent } from './young-favourites.component';

describe('YoungFavouritesComponent', () => {
  let component: YoungFavouritesComponent;
  let fixture: ComponentFixture<YoungFavouritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoungFavouritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoungFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
