import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TuiButton, TuiDataList, TuiTextfield, TuiScrollbar } from '@taiga-ui/core';
import { TuiSelect, TuiMultiSelect, TuiCheckbox, TuiTextarea, TuiDataListWrapper, TuiChip } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { EmpreendimentoService } from '../../../../../shared/service/empreendimento.service';

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
    TuiTextarea,
    TuiDataListWrapper,
    TuiChip,
  ]
})
export class ModalEmpreendimentoComponent implements OnInit, OnChanges {
  @Input() mostrarModal: boolean = false;
  @Input() modoEdicao: boolean = false;
  @Input() statusOptions: String[] = [];
  @Input() construtoraOptions: String[] = [];
  @Input() tiposImoveis: string[] = [];
  @Input() diferenciais: string[] = [];
  @Input() id: string = '';

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  protected formulario!: FormGroup;
  protected tiposOptions: any[] = [];
  protected diferenciaisOptions: any[] = [];
  protected quartosOptions = [
    { label: '0', checked: false },
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '5', checked: false },
    { label: '6', checked: false },
    { label: '7', checked: false },
    { label: '8', checked: false },
    { label: '9', checked: false },
    { label: '10', checked: false },
  ];
  protected banheirosOptions = [
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '5', checked: false },
    { label: '6', checked: false },
    { label: '7', checked: false },
    { label: '8', checked: false },
    { label: '9', checked: false },
    { label: '10', checked: false },
  ];
  protected vagasOptions = [
    { label: '0', checked: false },
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '6', checked: false },
    { label: '5', checked: false },
    { label: '7', checked: false },
    { label: '8', checked: false },
    { label: '9', checked: false },
    { label: '10', checked: false },
  ];
  protected titulosFixos = ['Breve Lançamento', 'Lançamento', 'Em Construção', 'Pronto']

  constructor(
    private fb: FormBuilder, 
    private empreendimentoService: EmpreendimentoService
  ){
    this.inicializarFormulario();
  }

  ngOnInit() {
    this.initializeOptions();
    this.setupFormValidators();
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

    if (changes['mostrarModal'] && this.mostrarModal && this.id && this.modoEdicao) {
      this.getDadosPorEmpreendimento();
    }
  }

  get steps(): FormArray {
    return this.formulario.get('steps') as FormArray;
  }

  getDadosPorEmpreendimento() { 
    this.empreendimentoService.getDadosByEmpreendimento(this.id).subscribe({
      next: (data: any) => {
        this.formulario.patchValue(data);
        this.updateCheckboxOptions(data);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  private updateCheckboxOptions(data: any) {
    if (data.quartos && Array.isArray(data.quartos)) {
      this.quartosOptions = this.quartosOptions.map(opt => ({
        ...opt,
        checked: data.quartos.includes(Number(opt.label))
      }));
    }

    if (data.banheiros && Array.isArray(data.banheiros)) {
      this.banheirosOptions = this.banheirosOptions.map(opt => ({
        ...opt,
        checked: data.banheiros.includes(Number(opt.label))
      }));
    }

    if (data.vagas && Array.isArray(data.vagas)) {
      this.vagasOptions = this.vagasOptions.map(opt => ({
        ...opt,
        checked: data.vagas.includes(Number(opt.label))
      }));
    }

    if (data.tiposImoveis) {
      this.updateTiposOptions();
    }

    if (data.diferenciais) {
      this.updateDiferenciaisOptions();
    }
  }

  private setupFormValidators() {
    if (!this.formulario) return;
    
    const requiredFields = ['titulo', 'tiposImoveis', 'status', 'construtora', 'endereco', 'cidade', 'bairro', 'areaMin', 'areaMax', 'precoMin', 'precoMax', 'quartos', 'banheiros', 'vagas'];
    requiredFields.forEach(field => {
      const control = this.formulario.get(field);
      if (control && !control.hasError('required')) {
        if (control.validator === null) {
          control.setValidators([Validators.required]);
          control.updateValueAndValidity();
        }
      }
    });
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      tiposImoveis: [[], Validators.required],
      status: ['', Validators.required],
      steps: this.fb.array(this.titulosFixos.map((titulo, index) => 
        this.fb.group({
          ordem: [index + 1],
          titulo: [titulo],
          data: [null],
          completado: [false]
        })
      )),
      construtora : ['', Validators.required],
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      areaMin: ['', Validators.required],
      areaMax: ['', Validators.required],
      banheiros: [[], Validators.required],
      quartos: [[], Validators.required],
      vagas: [[], Validators.required],
      precoMin: ['', Validators.required],
      precoMax: ['', Validators.required],
      descricao: [''],
      diferenciais: [[]],
    });
  }

  private updateTiposOptions() {
    if (!this.formulario || !this.tiposImoveis || this.tiposImoveis.length === 0) return;
    
    const selectedTipos = this.formulario?.get('tiposImoveis')?.value || [];
    this.tiposOptions = this.tiposImoveis.map(tipo => ({
      label: tipo,
      checked: Array.isArray(selectedTipos) ? selectedTipos.includes(tipo) : selectedTipos === tipo
    }));
  }

  private updateDiferenciaisOptions() {
    if (!this.formulario || !this.diferenciais || this.diferenciais.length === 0) return;
    
    const selectedDiferenciais = this.formulario?.get('diferenciais')?.value || [];
    this.diferenciaisOptions = this.diferenciais.map(dif => ({
      label: dif,
      checked: selectedDiferenciais.includes(dif)
    }));
  }

  private updateSelectedOptions() {
    if (!this.formulario || !this.modoEdicao) return;
    
    this.updateTiposOptions();
    this.updateDiferenciaisOptions();
  }


  private initializeOptions() {
    if (!this.tiposImoveis || !this.diferenciais) return;
    
    if (this.tiposImoveis.length > 0) {
      this.tiposOptions = this.tiposImoveis.map(tipo => ({
        label: tipo,
        checked: false
      }));
    }

    if (this.diferenciais.length > 0) {
      this.diferenciaisOptions = this.diferenciais.map(dif => ({
        label: dif,
        checked: false
      }));
    }
  }

  onTiposImoveisChange() {
    if (!this.formulario) return;
    
    const selectedTipos = this.tiposOptions
      .filter(option => option.checked)
      .map(option => option.label);

    this.formulario.patchValue({ tiposImoveis: selectedTipos });
    this.formulario.get('tiposImoveis')?.markAsTouched();
  }

  onDiferenciaisChange() {
    if (!this.formulario) return;
    
    const selectedDiferenciais = this.diferenciaisOptions
      .filter(option => option.checked)
      .map(option => option.label);

    this.formulario.patchValue({ diferenciais: selectedDiferenciais });
    this.formulario.get('diferenciais')?.markAsTouched();
  }

  onQuartosChange() {
    if (!this.formulario) return;
    
    const selectedQuartos = this.quartosOptions
      .filter(option => option.checked)
      .map(option => option.label);
    this.formulario.patchValue({ quartos: selectedQuartos });
    this.formulario.get('quartos')?.markAsTouched();
  }

  onBanheirosChange() {
    if (!this.formulario) return;
    
    const selectedBanheiros = this.banheirosOptions
      .filter(option => option.checked)
      .map(option => option.label);
    this.formulario.patchValue({ banheiros: selectedBanheiros });
    this.formulario.get('banheiros')?.markAsTouched();
  }

  onVagasChange() {
    if (!this.formulario) return;
    
    const selectedVagas = this.vagasOptions
      .filter(option => option.checked)
      .map(option => option.label);
    this.formulario.patchValue({ vagas: selectedVagas });
    this.formulario.get('vagas')?.markAsTouched();
  }

  updateStatus(selectedStatuses: any[]) {
    if (!this.formulario) return;
    
    if (selectedStatuses && selectedStatuses.length > 0) {
      const selectedStatus = selectedStatuses[0];
      this.formulario.patchValue({ status: selectedStatus });
    } else {
      this.formulario.patchValue({ status: null });
    }
  }

  updateConstrutora(selectedConstrutoras: any[]) {
    if (!this.formulario) return;
    
    if (selectedConstrutoras && selectedConstrutoras.length > 0) {
      const selectedConstrutora = selectedConstrutoras[0];
      this.formulario.patchValue({ construtora: selectedConstrutora });
    } else {
      this.formulario.patchValue({ construtora: null });
    }
  }

  isFormValid(): boolean {
    if (!this.formulario) return false;
    
    const requiredFields = [
      'titulo', 
      'tiposImoveis', 
      'status',
      'construtora', 
      'endereco',
      'cidade', 
      'bairro', 
      'areaMin', 
      'areaMax', 
      'precoMin', 
      'precoMax', 
      'quartos', 
      'banheiros', 
      'vagas'
    ];
    const fieldsValid = requiredFields.every(field => {
      const control = this.formulario.get(field);
      if (Array.isArray(control?.value)) {
        return control?.value.length > 0;
      }
      return control?.valid;
    });
    return fieldsValid;
  }

  // Funções para validação e tratamento de erros
  isFieldInvalid(fieldName: string): boolean {
    if (!this.formulario) return false;
    const field = this.formulario.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
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
    if (!this.formulario) return '';
    const field = this.formulario.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (field.hasError('min')) {
      return `Valor mínimo: ${field.getError('min').min}`;
    }
    if (field.hasError('minlength')) {
      return `Mínimo de caracteres: ${field.getError('minlength').requiredLength}`;
    }
    
    return 'Campo inválido';
  }

  markAllFieldsAsTouched() {
    if (!this.formulario) return;
    
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  onFecharModal(){
    this.fecharModal.emit();
  }

  onSalvar(){
    if (!this.formulario) return;
    
    this.markAllFieldsAsTouched();
    if (!this.isFormValid()) {
      console.error('Formulário inválido. Preencha todos os campos obrigatórios.');
      return;
    }

    const formData = {
      titulo: this.formulario.get('titulo')?.value || null,
      tiposImoveis: this.formulario.get('tiposImoveis')?.value || null,
      status: this.formulario.get('status')?.value || null,
      construtora: this.formulario.get('construtora')?.value || null,
      endereco: this.formulario.get('endereco')?.value || null,
      cidade: this.formulario.get('cidade')?.value || null,
      bairro: this.formulario.get('bairro')?.value || null,
      areaMin: this.formulario.get('areaMin')?.value || null,
      areaMax: this.formulario.get('areaMax')?.value || null,
      banheiros: this.formulario.get('banheiros')?.value || [],
      quartos: this.formulario.get('quartos')?.value || [],
      vagas: this.formulario.get('vagas')?.value || [],
      precoMin: this.formulario.get('precoMin')?.value || null,
      precoMax: this.formulario.get('precoMax')?.value || null,
      descricao: this.formulario.get('descricao')?.value || null,
      diferenciais: this.formulario.get('diferenciais')?.value || [],
      steps: this.formulario.get('steps')?.value || [],
      apartamentos: [],
    };

    this.salvar.emit(formData);
  }
}