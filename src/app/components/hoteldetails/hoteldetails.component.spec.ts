import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDetailsComponent } from './hoteldetails.component';

describe('HoteldetailsComponent', () => {
  let component: HotelDetailsComponent;
  let fixture: ComponentFixture<HotelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
