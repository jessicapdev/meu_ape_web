/* tslint:disable:no-unused-variable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MensagensRecebidasComponent } from './mensagens-recebidas.component';

describe('MensagensRecebidasComponent', () => {
  let component: MensagensRecebidasComponent;
  let fixture: ComponentFixture<MensagensRecebidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensagensRecebidasComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensagensRecebidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
