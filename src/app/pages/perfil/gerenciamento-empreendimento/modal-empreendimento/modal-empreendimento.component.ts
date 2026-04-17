import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TuiButton, TuiDataList, TuiTextfield, TuiScrollbar } from '@taiga-ui/core';
import { TuiSelect, TuiMultiSelect, TuiCheckbox } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-empreendimento',
  templateUrl: './modal-empreendimento.component.html',
  styleUrls: ['./modal-empreendimento.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TuiButton,
    TuiTextfield,
    TuiSelect,
    TuiMultiSelect,
    TuiDataList,
    TuiScrollbar,
    TuiCheckbox,
  ]
})
export class ModalEmpreendimentoComponent implements OnInit {
  @Input() mostrarModal: boolean = false;
  @Input() modoEdicao: boolean = false;
  @Input() formulario!: FormGroup;
  @Input() statusOptions: any[] = [];
  @Input() tiposImoveis: string[] = [];
  @Input() diferenciais: string[] = [];

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();

  tiposOptions: any[] = [];
  diferenciaisOptions: any[] = [];

  ngOnInit() {
    this.initializeOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tiposImoveis'] && changes['tiposImoveis'].currentValue) {
      this.updateTiposOptions();
    }

    if (changes['diferenciais'] && changes['diferenciais'].currentValue) {
      this.updateDiferenciaisOptions();
    }

    if (changes['modoEdicao'] || changes['formulario']) {
      this.updateSelectedOptions();
    }
  }


  private updateTiposOptions() {
    if (this.tiposImoveis && this.tiposImoveis.length > 0) {
      const selectedTipo = this.formulario?.get('tipoImovel')?.value;
      this.tiposOptions = this.tiposImoveis.map(tipo => ({
        label: tipo,
        checked: selectedTipo === tipo
      }));
    }
  }

  private updateDiferenciaisOptions() {
    if (this.diferenciais && this.diferenciais.length > 0) {
      const selectedDiferenciais = this.formulario?.get('diferenciais')?.value || [];
      this.diferenciaisOptions = this.diferenciais.map(dif => ({
        label: dif,
        checked: selectedDiferenciais.includes(dif)
      }));
    }
  }

  private updateSelectedOptions() {
    if (this.modoEdicao && this.formulario) {
      this.updateTiposOptions();
      this.updateDiferenciaisOptions();
      this.updateStatusFromForm();
    }
  }
  private updateStatusFromForm() {
    const currentStatus = this.formulario.get('status')?.value;
    if (currentStatus) {
      // Aqui poderíamos emitir um evento para o modal-status marcar o status correto
      // Mas como o modal-status gerencia seu próprio estado, isso pode ser feito
      // através de uma propriedade de entrada ou método público
    }
  }

  private initializeOptions() {
    if (this.tiposImoveis && this.tiposImoveis.length > 0) {
      this.tiposOptions = this.tiposImoveis.map(tipo => ({
        label: tipo,
        checked: false
      }));
    }

    if (this.diferenciais && this.diferenciais.length > 0) {
      this.diferenciaisOptions = this.diferenciais.map(dif => ({
        label: dif,
        checked: false
      }));
    }
  }

  onTipoImovelChange() {
    const selectedTipos = this.tiposOptions
      .filter(option => option.checked)
      .map(option => option.label);

    const selectedTipo = selectedTipos.length > 0 ? selectedTipos[0] : '';
    this.formulario.patchValue({ tipoImovel: selectedTipo });
  }

  onDiferenciaisChange() {
    const selectedDiferenciais = this.diferenciaisOptions
      .filter(option => option.checked)
      .map(option => option.label);

    this.formulario.patchValue({ diferenciais: selectedDiferenciais });
  }

  updateStatus(selectedStatuses: any[]) {
    if (selectedStatuses && selectedStatuses.length > 0) {
      const selectedStatus = selectedStatuses[0].label;
      this.formulario.patchValue({ status: selectedStatus });
    } else {
      // Se nenhum status selecionado, limpa o campo
      this.formulario.patchValue({ status: '' });
    }
  }

  onFecharModal(){
    this.fecharModal.emit();
  }

  onSalvar(){
    console.log(this.formulario.value)
    // this.salvar.emit(); 
  }
}