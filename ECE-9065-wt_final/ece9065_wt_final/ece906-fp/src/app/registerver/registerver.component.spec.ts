import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterverComponent } from './registerver.component';

describe('RegisterverComponent', () => {
  let component: RegisterverComponent;
  let fixture: ComponentFixture<RegisterverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
