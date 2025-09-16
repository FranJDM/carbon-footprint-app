import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionList } from './emission-list';

describe('EmissionList', () => {
  let component: EmissionList;
  let fixture: ComponentFixture<EmissionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
