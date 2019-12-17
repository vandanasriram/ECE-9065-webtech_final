import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninlandingComponent } from './signinlanding.component';

describe('SigninlandingComponent', () => {
  let component: SigninlandingComponent;
  let fixture: ComponentFixture<SigninlandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninlandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
