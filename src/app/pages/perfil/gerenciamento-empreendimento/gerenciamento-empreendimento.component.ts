import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { TuiButton, TuiDataList, TuiIcon, TuiLoader, TuiTextfield, TuiOption } from '@taiga-ui/core';
import { TuiCheckbox, TuiSelect } from '@taiga-ui/kit';
import { EmpreendimentoService } from '../../../../shared/service/empreendimento.service';
import { DetalheEmpreendimento } from '../../../pages/empreendimento/models/detalhe-empreendimento.model';
import { PageResponse } from '../../../../shared/models/page-response.model';
import { ModalEmpreendimentoComponent } from './modal-empreendimento/modal-empreendimento.component';

@Component({
  selector: 'app-gerenciamento-empreendimento',
  templateUrl: './gerenciamento-empreendimento.component.html',
  styleUrls: ['./gerenciamento-empreendimento.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    TuiButton,
    TuiTextfield,
    TuiSelect,
    TuiDataList,
    TuiCheckbox,
    TuiIcon,
    TuiLoader,
    ModalEmpreendimentoComponent
  ]
})
export class GerenciamentoEmpreendimentoComponent implements OnInit {
  empreendimentos: DetalheEmpreendimento[] = [];
  carregando: boolean = false;
  mostrarModal: boolean = false;
  modoEdicao: boolean = false;
  empreendimentoAtual: DetalheEmpreendimento | null = null;
  formulario!: FormGroup;
  pagina: number = 0;
  tamanho: number = 10;
  totalElementos: number = 0;

  // Seleção múltipla
  selectedEmpreendimentos: Set<any> = new Set();
  allSelected: boolean = false;

  // Colunas da tabela
  displayedColumns: string[] = ['select', 'titulo', 'status', 'cidade', 'action'];

  // Opções carregadas da API
  tiposImoveis: string[] = [];
  statusOptions: any[] = [];
  diferenciais: string[] = [];

  constructor(
    private empreendimentoService: EmpreendimentoService,
    private fb: FormBuilder
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.carregarOpcoes();
    this.carregarEmpreendimentos();
  }

  carregarOpcoes(): void {
    this.empreendimentoService.getTiposImoveis().subscribe({
      next: (tipos) => {
        this.tiposImoveis = tipos;
      },
      error: (erro) => {
        console.error('Erro ao carregar tipos de imóveis:', erro);
      }
    });

    this.empreendimentoService.getTiposStatus().subscribe({
      next: (status) => {
        this.statusOptions = status.map(s => ({ label: s, value: s }));
      },
      error: (erro) => {
        console.error('Erro ao carregar tipos de status:', erro);
      }
    });

    this.empreendimentoService.getDiferenciais().subscribe({
      next: (diferenciais) => {
        this.diferenciais = diferenciais;
      },
      error: (erro) => {
        console.error('Erro ao carregar diferenciais:', erro);
      }
    });
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      tiposImoveis: [[], Validators.required],
      status: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      areaMin: ['', Validators.required],
      areaMax: ['', Validators.required],
      banheiros: [[], Validators.required],
      quartos: [[], Validators.required],
      vagas: ['', Validators.required],
      precoMin: ['', Validators.required],
      precoMax: ['', Validators.required],
      descricao: [''],
      diferenciais: [[]],
      apartamentos: [[]],
      imagens: this.fb.group({
        banner: [''],
        map: [''],
        plantas: [[]],
        galeria: [[]]
      })
    });
  }

  carregarEmpreendimentos(): void {
    this.carregando = true;
    this.empreendimentoService.listar(this.pagina, this.tamanho).subscribe({
      next: (resposta: PageResponse<DetalheEmpreendimento>) => {
        this.empreendimentos = resposta.content;
        this.totalElementos = resposta.totalElements;
        this.selectedEmpreendimentos.clear();
        this.allSelected = false;
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar empreendimentos:', erro);
        this.carregando = false;
      }
    });
  }

  isSelected(empreendimento: DetalheEmpreendimento): boolean {
    return this.selectedEmpreendimentos.has(empreendimento);
  }

  toggleSelection(empreendimento: DetalheEmpreendimento, event: boolean): void {
    if (event) {
      this.selectedEmpreendimentos.add(empreendimento);
    } else {
      this.selectedEmpreendimentos.delete(empreendimento);
    }
    this.updateAllSelected();
  }

  toggleSelectAll(event: boolean): void {
    this.selectedEmpreendimentos.clear();
    if (event) {
      this.empreendimentos.forEach(emp => this.selectedEmpreendimentos.add(emp));
    }
    this.allSelected = event;
  }

  private updateAllSelected(): void {
    this.allSelected = this.empreendimentos.length > 0 && 
    this.selectedEmpreendimentos.size === this.empreendimentos.length;
  }

  hasSelection(): boolean {
    return this.selectedEmpreendimentos.size > 0;
  }

  deletarSelecionados(): void {
    if (this.selectedEmpreendimentos.size === 0) return;
    
    if (confirm(`Tem certeza que deseja deletar ${this.selectedEmpreendimentos.size} empreendimento(s)?`)) {
      const ids = Array.from(this.selectedEmpreendimentos).map(emp => (emp as any).id);
      
      ids.forEach(id => {
        this.empreendimentoService.deletar(id).subscribe({
          next: () => {
          },
          error: (erro: any) => {
            console.error('Erro ao deletar:', erro);
          }
        });
      });

      this.selectedEmpreendimentos.clear();
      this.allSelected = false;
      setTimeout(() => this.carregarEmpreendimentos(), 500);
    }
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.empreendimentoAtual = null;
    this.formulario.reset();
    this.formulario.patchValue({
      tipoImovel: '',
      views: 0,
      dias: 0,
      banheiros: [],
      quartos: [],
      vagas: [],
      diferenciais: [],
      areasLazer: [],
      apartamentos: [],
      imagens: {
        banner: '',
        map: '',
        plantas: [],
        galeria: []
      }
    });
    this.mostrarModal = true;
  }

  abrirModalEdicao(empreendimento: DetalheEmpreendimento): void {
    this.modoEdicao = true;
    this.empreendimentoAtual = empreendimento;
    this.formulario.patchValue(empreendimento);
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.formulario.reset();
    this.empreendimentoAtual = null;
  }

  salvar(): void {
    if (this.formulario.invalid) {
      return;
    }

    const dados = this.formulario.value;

    if (this.modoEdicao && this.empreendimentoAtual) {
      const id = (this.empreendimentoAtual as any).id;
      this.empreendimentoService.atualizar(id, dados).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarEmpreendimentos();
        },
        error: (erro: any) => {
          console.error('Erro ao atualizar:', erro);
        }
      });
    } else {
      this.empreendimentoService.criar(dados).subscribe({
        next: () => {
          this.fecharModal();
          this.carregarEmpreendimentos();
        },
        error: (erro: any) => {
          console.error('Erro ao criar:', erro);
        }
      });
    }
  }

  deletar(empreendimento: DetalheEmpreendimento): void {
    if (confirm('Tem certeza que deseja deletar este empreendimento?')) {
      const id = (empreendimento as any).id;
      this.empreendimentoService.deletar(id).subscribe({
        next: () => {
          this.carregarEmpreendimentos();
        },
        error: (erro: any) => {
          console.error('Erro ao deletar:', erro);
        }
      });
    }
  }

  proximaPagina(): void {
    if ((this.pagina + 1) * this.tamanho < this.totalElementos) {
      this.pagina++;
      this.carregarEmpreendimentos();
    }
  }

  paginaAnterior(): void {
    if (this.pagina > 0) {
      this.pagina--;
      this.carregarEmpreendimentos();
    }
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalElementos / this.tamanho);
  }
}
