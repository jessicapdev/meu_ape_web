import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';

@Component({
  selector: 'app-modal-status',
  imports: [
    CommonModule,
    FormsModule,
    TuiChip,
    TuiButton
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  templateUrl: './modal-status.component.html',
  styleUrl: './modal-status.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ModalStatusComponent {
  @Output() updateStatus = new EventEmitter<any>();
  @Input() statusOptions: any[] = [];

  

  constructor() {}

  limparFiltro(): void {
    this.statusOptions.map(quarto =>{
      quarto.checked = false;
    })
  }

  aplicar(): void {
    this.updateStatus.emit(this.selectedStatus);
  }

  get selectedStatus(): string[] {
    return this.statusOptions
      .filter(status => status.checked)
      .map(status => status.label);
  }
}
