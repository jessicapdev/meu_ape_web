import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA, Output } from '@angular/core';
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

  protected listStatus: any;
  statusOptions = [
    { label: 'Pronto para morar', checked: false },
    { label: 'Em construção', checked: false },
    { label: 'Lançamento', checked: false }
  ];

  constructor() {}

  limparFiltro(): void {
    this.statusOptions.map(quarto =>{
      quarto.checked = false;
    })
  }

  aplicar(): void {
    this.listStatus = this.selectedStatus;
    this.updateStatus.emit(this.listStatus);
  }

  get selectedStatus(): any {
    return this.statusOptions.filter(status => status.checked);
  }
}
