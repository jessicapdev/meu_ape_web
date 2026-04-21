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
  protected filtro: EmpreendimentoFiltro = {
    page: 0,
    size: 8,
    tiposImoveis: [],
    diferenciais: []
  };
  protected incialSearchForm = new FormGroup({
    local: new FormControl('')
  })

  constructor(
    private router: Router,
    private service: EmpreendimentoService 
  ) {}

  ngOnInit(): void {
    this.getEmpreendimentos()
  }

  onSubmit(){
    console.log(this.incialSearchForm.value);
  }

  getEmpreendimentos(): EmpreendimentoHome[] {
    this.loading = true;
    this.service.getListaEmpreendimentos()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data: any) => {
          this.empreendimentos = data.content || [];
          this.length = Math.ceil(data.length / this.pageSize) || 1;
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
    this.openDropQuartos = false;
  }
  
  updateStatus(event: any){
    this.openDropStatus = false;
  }

  updatePreco(event: any){
    this.openDropPreco = false;
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

}