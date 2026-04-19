import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiTextfield, TuiScrollbar } from '@taiga-ui/core';
import { TuiSelect, TuiMultiSelect, TuiCheckbox, TuiTextarea, TuiDataListWrapper, TuiFilterByInputPipe, TUI_COUNTRIES, TuiChip } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { ImagePickerComponent } from '../../../../shared/components/image-picker/image-picker.component';

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
    ImagePickerComponent,
  ]
})
export class ModalEmpreendimentoComponent implements OnInit {
  @Input() mostrarModal: boolean = false;
  @Input() modoEdicao: boolean = false;
  @Input() formulario!: FormGroup;
  @Input() statusOptions: String[] = [];
  @Input() tiposImoveis: string[] = [];
  @Input() diferenciais: string[] = [];

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();

  protected tiposOptions: any[] = [];
  protected diferenciaisOptions: any[] = [];
  protected statusSelected: string | null = null;
  protected quartosOptions = [
    { label: '0', checked: false },
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '5+', checked: false },
  ];
  protected banheirosOptions = [
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '5', checked: false },
    { label: '6+', checked: false },
  ];
  protected vagasOptions = [
    { label: '0', checked: false },
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '5+', checked: false },
  ];

  // Propriedades para gerenciar imagens
  protected imagens = {
    banner: '',
    map: '',
    plantas: [] as string[],
    galeria: [] as string[]
  };

  protected previewBanner: string[] = [];
  protected previewMap: string[] = [];
  protected previewPlantas: string[] = [];
  protected previewGaleria: string[] = [];

  ngOnInit() {
    this.initializeOptions();
    this.setupFormValidators();
  }

  private setupFormValidators() {
    // Adiciona validadores aos campos obrigatórios se ainda não existirem
    const requiredFields = ['titulo', 'tiposImoveis', 'status', 'cidade', 'bairro', 'areaMin', 'areaMax', 'precoMin', 'precoMax', 'quartos', 'banheiros', 'vagas'];
    
    requiredFields.forEach(field => {
      const control = this.formulario.get(field);
      if (control && !control.hasError('required')) {
        // Se o campo não tem validador, adiciona
        if (control.validator === null) {
          control.setValidators([Validators.required]);
          control.updateValueAndValidity();
        }
      }
    });
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
      const selectedTipo = this.formulario?.get('tiposImoveis')?.value;
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

  onTiposImoveisChange() {
    const selectedTipos = this.tiposOptions
      .filter(option => option.checked)
      .map(option => option.label);

    this.formulario.patchValue({ tiposImoveis: selectedTipos });
    this.formulario.get('tiposImoveis')?.markAsTouched();
  }

  onDiferenciaisChange() {
    const selectedDiferenciais = this.diferenciaisOptions
      .filter(option => option.checked)
      .map(option => option.label);

    this.formulario.patchValue({ diferenciais: selectedDiferenciais });
    this.formulario.get('diferenciais')?.markAsTouched();
  }

  onQuartosChange() {
    const selectedQuartos = this.quartosOptions
      .filter(option => option.checked)
      .map(option => option.label);
    this.formulario.patchValue({ quartos: selectedQuartos });
    this.formulario.get('quartos')?.markAsTouched();
  }

  onBanheirosChange() {
    const selectedBanheiros = this.banheirosOptions
      .filter(option => option.checked)
      .map(option => option.label);
    this.formulario.patchValue({ banheiros: selectedBanheiros });
    this.formulario.get('banheiros')?.markAsTouched();
  }

  onVagasChange() {
    const selectedVagas = this.vagasOptions
      .filter(option => option.checked)
      .map(option => option.label);
    this.formulario.patchValue({ vagas: selectedVagas });
    this.formulario.get('vagas')?.markAsTouched();
  }

  updateStatus(selectedStatuses: any[]) {
    if (selectedStatuses && selectedStatuses.length > 0) {
      const selectedStatus = selectedStatuses[0];
      this.formulario.patchValue({ status: selectedStatus });
    } else {
      this.formulario.patchValue({ status: null });
    }
  }

  compareStatus(s1: any, s2: any): boolean {
    return s1 && s2 ? s1.value === s2.value : s1 === s2;
  }

  // Funções para gerenciar imagens
  onBannerSelected(imagemBase64: string | string[]) {
    if (typeof imagemBase64 === 'string') {
      this.imagens.banner = imagemBase64;
      this.previewBanner = imagemBase64 ? [imagemBase64] : [];
    }
  }

  onMapSelected(imagemBase64: string | string[]) {
    if (typeof imagemBase64 === 'string') {
      this.imagens.map = imagemBase64;
      this.previewMap = imagemBase64 ? [imagemBase64] : [];
    }
  }

  onPlantasSelected(imagensBase64: string | string[]) {
    if (Array.isArray(imagensBase64)) {
      this.imagens.plantas = imagensBase64;
      this.previewPlantas = imagensBase64;
    }
  }

  onGaleriaSelected(imagensBase64: string | string[]) {
    if (Array.isArray(imagensBase64)) {
      this.imagens.galeria = imagensBase64;
      this.previewGaleria = imagensBase64;
    }
  }

  // Função para obter as imagens formatadas
  getImagensFormatadas() {
    return {
      banner: this.imagens.banner,
      map: this.imagens.map,
      plantas: this.imagens.plantas,
      galeria: this.imagens.galeria
    };
  }

  // Função para limpar todas as imagens
  clearAllImages() {
    this.imagens = {
      banner: '',
      map: '',
      plantas: [],
      galeria: []
    };
    this.previewBanner = [];
    this.previewMap = [];
    this.previewPlantas = [];
    this.previewGaleria = [];
  }

  // Funções para validação e tratamento de erros
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formulario.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.formulario.get(fieldName);
    if (!field) return false;
    
    // Para arrays (banheiros, quartos, vagas)
    if (Array.isArray(field.value)) {
      return !!(field.dirty || field.touched) && field.value.length === 0;
    }
    
    // Para campos normais
    return !!(field.dirty || field.touched) && !field.valid;
  }

  getErrorMessage(fieldName: string): string {
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
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  isFormValid(): boolean {
    // Validação customizada: quartos, banheiros, vagas, banner e map não podem estar vazios
    const requiredFields = ['titulo', 'tiposImoveis', 'status', 'cidade', 'bairro', 'areaMin', 'areaMax', 'precoMin', 'precoMax', 'quartos', 'banheiros', 'vagas'];
    const requiredImages = !!(this.imagens.banner && this.imagens.map);
    
    const fieldsValid = requiredFields.every(field => {
      const control = this.formulario.get(field);
      if (Array.isArray(control?.value)) {
        return control?.value.length > 0;
      }
      return control?.valid;
    });

    return fieldsValid && requiredImages;
  }

  onFecharModal(){
    this.fecharModal.emit();
  }

  onSalvar(){
    // Marca todos os campos como tocados para exibir erros
    this.markAllFieldsAsTouched();

    if (!this.isFormValid()) {
      console.error('Formulário inválido. Preencha todos os campos obrigatórios.');
      return;
    }

    const formData = {
      titulo: this.formulario.get('titulo')?.value || null,
      tiposImoveis: this.formulario.get('tiposImoveis')?.value || null,
      status: this.formulario.get('status')?.value || null,
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
      apartamentos: [],
      imagens: this.getImagensFormatadas()
    };

    this.salvar.emit();
  }
}