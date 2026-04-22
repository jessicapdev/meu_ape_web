import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDropdown, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper, TuiMultiSelect, TuiSelect } from '@taiga-ui/kit';

@Component({
  selector: 'app-modal-apartamentos',
  templateUrl: './modal-apartamentos.component.html',
  styleUrls: ['./modal-apartamentos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiDataListWrapper,
    TuiChevron,
    TuiDataList,
    TuiDropdown,
    TuiSelect,
    TuiMultiSelect,
    TuiDataList,
    TuiDataListWrapper,
    TuiButton
  ]
})
export class ModalApartamentosComponent implements OnInit {
  @Input() mostrarModal: boolean = false;
  @Input() id!: string;
  @Input() tiposOptions: string[] = [];

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  protected formulario!: FormGroup;

  constructor(private fb: FormBuilder) { 
    this.inicializarFormulario();
  }

  ngOnInit() {
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      id: [''],
      tipoImovel: ['', Validators.required],
      area: ['', Validators.required],
      numeroBanheiro: ['', Validators.required],
      numeroQuarto: ['', Validators.required],
      numeroSuite: ['', Validators.required],
      numeroVaga: ['', Validators.required],
      precoInicial: ['', Validators.required],
      planta: ['']
    });
  }

  onFecharModal(){
    this.fecharModal.emit();
  }

  onSalvar(){
    this.salvar.emit();
  }

  shouldShowError(fieldName: string): boolean {
    if (!this.formulario) return false;
    const field = this.formulario.get(fieldName);
    if (!field) return false;
    
    if (Array.isArray(field.value)) {
      return !!(field.dirty || field.touched) && field.value.length === 0;
    }
    
    return !!(field.dirty || field.touched) && !field.valid;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.formulario.get(fieldName);
    if (!field) return '';
    
    if (field.errors?.['required']) {
      return 'Campo obrigatório';
    }
    
    if (field.errors?.['minlength']) {
      const requiredLength = field.errors['minlength'].requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }
    
    if (field.errors?.['pattern']) {
      return 'Formato inválido';
    }
    
    return 'Campo inválido';
  }
}
