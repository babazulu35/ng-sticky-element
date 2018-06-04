import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineTextComponent } from './inline-text.component';

describe('InlineTextComponent', () => {
  let component: InlineTextComponent;
  let fixture: ComponentFixture<InlineTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
