import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
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
  @Input() quartosOptions: any[] = [];

  constructor() {}

  limparFiltro(): void {
    this.quartosOptions.map(quarto =>{
      quarto.checked = false;
    })
  }

  get selectedQuartos(): number[] {
    return this.quartosOptions
      .filter(quarto => quarto.checked)
      .map(quarto => quarto.label === 'Studio' ? 0 : Number(quarto.label));
  }

  aplicar(): void {
    this.updateQuartos.emit(this.selectedQuartos);
  }
}
