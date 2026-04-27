import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDropdown, TuiDropdownDirective, TuiDropdownOpen, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalQuartosComponent } from '../../../shared/components/modal-quartos/modal-quartos.component';
import { ModalStatusComponent } from '../../../shared/components/modal-status/modal-status.component';
import { ModalPrecoComponent } from '../../../shared/components/modal-preco/modal-preco.component';
import { ModalFiltrarComponent } from '../../../shared/components/modal-filtrar/modal-filtrar.component';
import { TuiBadge, TuiCarousel, TuiChevron, TuiPagination } from '@taiga-ui/kit';
import { TuiActiveZone } from '@taiga-ui/cdk/directives/active-zone';
import { Router } from '@angular/router';
import { Empreendimento } from '../../../shared/models/empreendimento.model';
import { EmpreendimentoService } from '../../../shared/service/empreendimento.service';
import { EmpreendimentoFiltro } from '../../../shared/models/empreendimento-filtro.model';
import { finalize } from 'rxjs';
import { EmpreendimentoHome } from '../empreendimento/models/detalhe-empreendimento.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TuiTextfield,
    TuiDropdown,
    TuiDropdownOpen,
    TuiIcon,
    TuiLoader,
    TuiButton,
    TuiChevron,
    TuiActiveZone,
    TuiCarousel,
    TuiBadge,
    TuiPagination,
    TuiDropdownDirective,
    ModalQuartosComponent,
    ModalStatusComponent,
    ModalPrecoComponent,
    ModalFiltrarComponent
],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit{
  @ViewChild('filtrarDialog', { static: true })
  filtrarDialog!: ModalFiltrarComponent;

  protected openDropQuartos = false;
  protected openDropStatus = false;
  protected openDropPreco = false;
  protected openDropFiltrar = false;
  protected loading = false;
  protected length = 0;
  protected index = 0;
  protected pageSize = 8;
  protected empreendimentos: EmpreendimentoHome[] = [];
  protected quartosOptions: any[] = [
    { label: 'Studio', checked: false },
    { label: '1', checked: false },
    { label: '2', checked: false },
    { label: '3', checked: false },
    { label: '4', checked: false },
    { label: '5', checked: false },
  ];
  protected statusOptions: any[] = [
    { label: 'Pre lançamento', checked: false },
    { label: 'Pronto', checked: false },
    { label: 'Em construção', checked: false },
    { label: 'Lançamento', checked: false }
  ];
  protected precoForm = new FormGroup({
    inicial: new FormControl(null),
    final: new FormControl(null)
  });

  protected filtro: EmpreendimentoFiltro = {
    search: '',
    quartos: [],
    precoMin: undefined,
    precoMax: undefined,
    status: [],
    areaMin: undefined,
    areaMax: undefined,
    banheiros: [],
    vagas: [],
    tiposImoveis: [],
    diferenciais: [],
    page: 0,
    size: 8,
    sortBy: '',
    sortDirection: 'ASC'
  };

  protected incialSearchForm = new FormGroup({
    search: new FormControl('')
  });

  constructor(
    private router: Router,
    private service: EmpreendimentoService 
  ) {}

  ngOnInit(): void {
    this.getEmpreendimentos()
  }

  getEmpreendimentos(): EmpreendimentoHome[] {
    this.loading = true;
    this.service.getListaEmpreendimentos(this.filtro)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data: any) => {
          this.empreendimentos = data.content || [];
          this.length = this.empreendimentos.length > 0 ? data.totalPages : 1;
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    return this.empreendimentos;
  }


  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarQuartos(quartos: number[]): string {
    const primeiro = quartos[0];
    const ultimo = quartos[quartos.length - 1];
    const primeiroStr = primeiro === 0 ? 'studio' : primeiro.toString();
    const ultimoStr = ultimo >= 5 ? '4+' : ultimo.toString();
    return `${primeiroStr} - ${ultimoStr}`;
  }

  formatarBanheiros(banheiros: number[]): string {
    const primeiro = banheiros[0];
    const ultimo = banheiros[banheiros.length - 1];
    return `${primeiro} - ${ultimo}`;
  }

  formatarVagas(vagas: number[]): string {
    const primeiro = vagas[0];
    const ultimo = vagas[vagas.length - 1];
    return `${primeiro} - ${ultimo}`;
  }

  updateQuartos(event: any){
    this.filtro.quartos = event;
    this.getEmpreendimentos();
    this.index = 0;
    this.filtro.page = 0;
    this.openDropQuartos = false;
  }
  
  updateStatus(event: any){
    this.filtro.status = event;
    this.getEmpreendimentos();
    this.index = 0;
    this.filtro.page = 0;
    this.openDropStatus = false;
  }

  updatePreco(event: any){
    this.filtro.precoMin = event.inicial;
    this.filtro.precoMax = event.final;
    this.index = 0;
    this.filtro.page = 0;
    this.getEmpreendimentos();
    this.openDropPreco = false;
  }

  updateFiltrar(event: any){
    this.filtro = { ...this.filtro, ...event };
    this.index = 0;
    this.filtro.page = 0;
    this.getEmpreendimentos();
  }

  openFiltrar(){
    this.filtrarDialog.showModal();
  }

  navegarParaDetalhe(empreendimento: EmpreendimentoHome): void {
    this.router.navigate(['/empreendimento', empreendimento.id]);
  }

  goToPage(index: number): void {
    this.index = index;
    this.filtro.page = index;
    this.getEmpreendimentos();
  }

  buscarEmpreendimento(): void {
    const search = this.incialSearchForm.get('search')?.value || '';
    this.filtro.search = search;
    this.index = 0;
    this.filtro.page = 0;
    this.getEmpreendimentos();
  }

}