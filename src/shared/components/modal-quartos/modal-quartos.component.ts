import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiButton } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';

@Component({
  selector: 'app-modal-quartos',
  standalone: true,
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
  templateUrl: './modal-quartos.component.html',
  styleUrl: './modal-quartos.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ModalQuartosComponent {
  @Output() updateQuartos = new EventEmitter<any>();

  protected listQuartos: any;
  protected quartosOptions = [
    { label: 'Studio', checked: false },
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '5+', checked: false },
  ];

  constructor() {}

  limparFiltro(): void {
    this.quartosOptions.map(quarto =>{
      quarto.checked = false;
    })
  }

  get selectedQuartos(): any {
    return this.quartosOptions.filter(quarto => quarto.checked);
  }

  aplicar(): void {
    this.listQuartos = this.selectedQuartos;
    this.updateQuartos.emit(this.listQuartos);
  }

}
