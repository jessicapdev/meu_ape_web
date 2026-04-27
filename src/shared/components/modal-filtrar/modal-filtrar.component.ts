import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAppearance, TuiButton, TuiDialog, TuiScrollbar, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCheckbox, TuiChip, TuiInputNumber } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { EmpreendimentoFiltro } from '../../models/empreendimento-filtro.model';

@Component({
  selector: 'app-modal-filtrar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiDialog,
    TuiButton,
    TuiTextfield,
    TuiInputNumber,
    TuiScrollbar,
    TuiAppearance,
    TuiCardLarge,
    TuiChip,
    TuiHeader,
    TuiTitle,
    TuiCheckbox,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  templateUrl: './modal-filtrar.component.html',
  styleUrl: './modal-filtrar.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})

export class ModalFiltrarComponent {
  @Input() filtroOptions!: EmpreendimentoFiltro;
  @Output() updateFiltro = new EventEmitter<any>();

  open = false;
  protected inicial: number | null = null;
  protected final: number | null = null;

  protected filtrarForm = new FormGroup({
    areaMinima: new FormControl(undefined),
    areaMaxima: new FormControl(undefined)
  })

  protected banheirosOptions = [
    { label: 1, checked: false },
    { label: 2, checked: false },
    { label: 3, checked: false },
    { label: 4, checked: false },
    { label: 5, checked: false },
  ];

  protected vagasOptions = [
    { label: 1, checked: false },
    { label: 2, checked: false },
    { label: 3, checked: false },
    { label: 4, checked: false },
    { label: 5, checked: false },
  ];

  protected tiposOptions = [
    { label: 'Apartamento', checked: false },
    { label: 'Casa', checked: false },
    { label: 'Cobertura/Rooftop', checked: false },
    { label: 'Duplex', checked: false },
    { label: 'Garden', checked: false },
    { label: 'Loteamento', checked: false },
    { label: 'Penthouse', checked: false },
    { label: 'Studio', checked: false },
    { label: 'Townhouse', checked: false },
    { label: 'Triplex', checked: false },
    { label: 'Up House', checked: false }
  ];

  protected diferenciaisOptions = [
    { label: 'Área de lazer', checked: false },
    { label: 'Área verde privativa', checked: false },
    { label: 'Bicicletário', checked: false },
    { label: 'Lojas no térreo', checked: false },
    { label: 'Complexo multiuso', checked: false },
    { label: 'Coworking', checked: false },
    { label: 'Elevadores com biometria', checked: false },
    { label: 'Espaço delivery', checked: false },
    { label: 'Lazer elevado acima do térreo', checked: false },
    { label: 'Lazer na cobertura', checked: false },
    { label: 'Pet place', checked: false },
    { label: 'Piscina climatizada', checked: false },
    { label: 'Piscina', checked: false },
    { label: 'Ponto para carro elétrico', checked: false },
    { label: 'Portaria virtual', checked: false },
    { label: 'Quadra de tênis', checked: false },
    { label: 'Torre única', checked: false },
    { label: 'Um por andar', checked: false },
    { label: 'Vaga box', checked: false },
    { label: 'Vaga coberta', checked: false },
    { label: 'Vaga determinadas', checked: false },
    { label: 'Vista para o mar', checked: false },
    { label: 'Wi-fi nas áreas comuns', checked: false },
  ];

  constructor() {}

  limparFiltro(): void {
    this.filtrarForm.reset();
    this.vagasOptions.forEach(opt => opt.checked = false);
    this.banheirosOptions.forEach(opt => opt.checked = false);
    this.tiposOptions.forEach(opt => opt.checked = false);
    this.diferenciaisOptions.forEach(opt => opt.checked = false);
  }

  aplicar(): void {
    const filtroCompilado = {
      areaMin: Number(this.filtrarForm.get('areaMinima')?.value) || undefined,
      areaMax: Number(this.filtrarForm.get('areaMaxima')?.value) || undefined,
      vagas: this.vagasOptions.filter(o => o.checked).map(o => o.label),
      banheiros: this.banheirosOptions.filter(o => o.checked).map(o => o.label),
      tiposImoveis: this.tiposOptions.filter(o => o.checked).map(o => o.label),
      diferenciais: this.diferenciaisOptions.filter(o => o.checked).map(o => o.label)
    };

    this.updateFiltro.emit(filtroCompilado);
    this.open = false;
  }

  showModal(): void {
    this.open = true;
  }
}
