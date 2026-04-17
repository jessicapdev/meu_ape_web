import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmpreendimentoComponent } from './modal-empreendimento.component';

describe('ModalEmpreendimentoComponent', () => {
  let component: ModalEmpreendimentoComponent;
  let fixture: ComponentFixture<ModalEmpreendimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEmpreendimentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEmpreendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});