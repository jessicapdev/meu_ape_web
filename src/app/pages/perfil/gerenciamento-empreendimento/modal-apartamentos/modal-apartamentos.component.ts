import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDropdown, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper, TuiMultiSelect, TuiSelect } from '@taiga-ui/kit';
import { Apartamento } from '../../../empreendimento/models/apartamento.model';
import { EmpreendimentoService } from '../../../../../shared/service/empreendimento.service';
import { EmpreendimentoPerfil } from '../../../empreendimento/models/detalhe-empreendimento.model';

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
  @Input() empreendimento: EmpreendimentoPerfil = {} as EmpreendimentoPerfil;
  @Input() tiposOptions: string[] = [];
  @Input() apartamentos: Apartamento[] = [];

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();
  @Output() deletar = new EventEmitter<{ idEmpreendimento: string; idApartamento: string }>();

  formulario!: FormGroup;
  mostrarFormAdicionar = false;

  constructor(
    private fb: FormBuilder,
    private empreendimentoService: EmpreendimentoService
  ) {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mostrarModal'] && this.mostrarModal && this.empreendimento.id) {
      this.getApartamentos();
    }
  }

  private getApartamentos(): void { 
    this.empreendimentoService.getApartamentosByEmpreendimento(this.empreendimento.id || '').subscribe({
      next: (apartamentos: Apartamento[]) => {
        this.apartamentos = apartamentos;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {}

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      id: [''],
      tipo: ['', Validators.required],
      area: [null, [Validators.required, Validators.min(0)]],
      quartos: [null, [Validators.required, Validators.min(0)]],
      suites: [null, [Validators.required, Validators.min(0)]],
      banheiros: [null, [Validators.required, Validators.min(0)]],
      vagas: [null, [Validators.required, Validators.min(0)]],
      preco: [null]
    });
  }

  toggleFormAdicionar(): void {
    this.mostrarFormAdicionar = !this.mostrarFormAdicionar;
    if (this.mostrarFormAdicionar) {
      this.formulario.reset();
      this.formulario.markAsPristine();
      this.formulario.markAsUntouched();
    }
  }

  onSalvar(): void {
    if (this.formulario.valid) {
      this.empreendimentoService.salvarApartamentos(this.empreendimento.id || '', this.formulario.value).subscribe({
        next: () => {
          this.getApartamentos();
          this.formulario.reset();
          this.toggleFormAdicionar();
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    } else {
      this.formulario.markAllAsTouched(); 
      this.toggleFormAdicionar();
    }
  }

  onDeletar(idApartamento: string): void {
    this.empreendimentoService.deletarApartamento(this.empreendimento.id || '', idApartamento).subscribe({
      next: () => {
        this.getApartamentos();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  onFecharModal(): void {
    this.fecharModal.emit();
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.formulario.get(fieldName);
    return !!(control?.touched && control?.invalid);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.formulario.get(fieldName);
    if (control?.errors?.['required']) return 'Campo obrigatório';
    if (control?.errors?.['min']) return 'Valor deve ser maior ou igual a 0';
    return 'Valor inválido';
  }
}