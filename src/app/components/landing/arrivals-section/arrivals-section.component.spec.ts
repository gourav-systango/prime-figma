import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrivalsSectionComponent } from './arrivals-section.component';

describe('ArrivalsSectionComponent', () => {
  let component: ArrivalsSectionComponent;
  let fixture: ComponentFixture<ArrivalsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrivalsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrivalsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
