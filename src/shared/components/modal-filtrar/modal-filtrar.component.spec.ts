import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFiltrarComponent } from './modal-filtrar.component';

describe('ModalFiltrarComponent', () => {
  let component: ModalFiltrarComponent;
  let fixture: ComponentFixture<ModalFiltrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFiltrarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFiltrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
