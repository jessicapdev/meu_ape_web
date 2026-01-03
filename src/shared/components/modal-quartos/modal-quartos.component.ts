import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiDialog } from '@taiga-ui/core';

@Component({
  selector: 'app-modal-quartos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiDialog
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  templateUrl: './modal-quartos.component.html',
  styleUrl: './modal-quartos.component.scss'
})
export class ModalQuartosComponent {

  @Input() open = false;
  quartosOptions = ['Studio', '1', '2', '3', '4', '5+'];
  selectedQuartos: string[] = [];

  constructor() {}

  isSelected(option: string): boolean {
    return this.selectedQuartos.includes(option);
  }

  limparFiltro(): void {
    this.selectedQuartos = [];
  }

  aplicar(): void {
  }
}
