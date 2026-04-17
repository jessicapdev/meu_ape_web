/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GerenciamentoEmpreendimentoComponent } from './gerenciamento-empreendimento.component';

describe('GerenciamentoEmpreendimentoComponent', () => {
  let component: GerenciamentoEmpreendimentoComponent;
  let fixture: ComponentFixture<GerenciamentoEmpreendimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenciamentoEmpreendimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciamentoEmpreendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
