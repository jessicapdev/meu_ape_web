import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrecoComponent } from './modal-preco.component';

describe('ModalPrecoComponent', () => {
  let component: ModalPrecoComponent;
  let fixture: ComponentFixture<ModalPrecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPrecoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPrecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
