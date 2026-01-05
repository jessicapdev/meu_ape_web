import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiInputNumber } from '@taiga-ui/kit';

@Component({
  selector: 'app-modal-preco',
  imports: [
    CommonModule,
    FormsModule,
    TuiButton,
    TuiCurrencyPipe,
    TuiTextfield,
    TuiInputNumber,
    ReactiveFormsModule
],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  templateUrl: './modal-preco.component.html',
  styleUrl: './modal-preco.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class ModalPrecoComponent {
  @Output() updatePreco = new EventEmitter<any>();

  protected listPreco: any;
  protected precoForm = new FormGroup({
    inicial: new FormControl(null),
    final: new FormControl(null)
  })

  constructor() {}

  limparFiltro(): void {
    this.precoForm.reset();
  }

  aplicar(): void {
    this.listPreco = this.precoForm.value;
    this.updatePreco.emit(this.listPreco);
  }

}
