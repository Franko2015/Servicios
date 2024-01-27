import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesTicketsComponent } from './services-tickets.component';

describe('ServicesTicketsComponent', () => {
  let component: ServicesTicketsComponent;
  let fixture: ComponentFixture<ServicesTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesTicketsComponent]
    });
    fixture = TestBed.createComponent(ServicesTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
