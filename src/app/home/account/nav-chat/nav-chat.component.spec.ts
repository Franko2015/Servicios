import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavChatComponent } from './nav-chat.component';

describe('NavChatComponent', () => {
  let component: NavChatComponent;
  let fixture: ComponentFixture<NavChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavChatComponent]
    });
    fixture = TestBed.createComponent(NavChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
