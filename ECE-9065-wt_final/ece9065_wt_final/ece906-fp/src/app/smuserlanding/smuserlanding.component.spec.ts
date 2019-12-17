import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmuserlandingComponent } from './smuserlanding.component';

describe('SmuserlandingComponent', () => {
  let component: SmuserlandingComponent;
  let fixture: ComponentFixture<SmuserlandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmuserlandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmuserlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
