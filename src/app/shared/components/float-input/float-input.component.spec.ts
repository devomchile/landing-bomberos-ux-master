import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatInputComponent } from './float-input.component';

describe('FloatInputComponent', () => {
  let component: FloatInputComponent;
  let fixture: ComponentFixture<FloatInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FloatInputComponent]
    });
    fixture = TestBed.createComponent(FloatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
