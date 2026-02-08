import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDropdown, TuiDropdownDirective, TuiDropdownOpen, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalQuartosComponent } from '../../../shared/components/modal-quartos/modal-quartos.component';
import { ModalStatusComponent } from '../../../shared/components/modal-status/modal-status.component';
import { ModalPrecoComponent } from '../../../shared/components/modal-preco/modal-preco.component';
import { ModalFiltrarComponent } from '../../../shared/components/modal-filtrar/modal-filtrar.component';
import { TuiBadge, TuiCarousel, TuiChevron, TuiPagination } from '@taiga-ui/kit';
import { TuiActiveZone } from '@taiga-ui/cdk/directives/active-zone';
import { Router } from '@angular/router';

interface Empreendimento {
  titulo: string;
  status: string;
  cidade: string;
  Bairro: string;
  metragem: string;
  banheiros: number;
  quartos: string;
  vagas: number;
  valorInicial: number;
  imagem: string;
}

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
export class HomeComponent  {
  @ViewChild('filtrarDialog', { static: true })
  filtrarDialog!: ModalFiltrarComponent;

  protected openDropQuartos = false;
  protected openDropStatus = false;
  protected openDropPreco = false;
  protected openDropFiltrar = false;
  protected length = 20;
  protected index = 0;

  protected incialSearchForm = new FormGroup({
    local: new FormControl('')
  })

  empreendimentos: Empreendimento[] = [
    {
      titulo: "Residencial Vitória",
      status: "Pronto para morar",
      cidade: "São Paulo",
      Bairro: "Piriruba",
      metragem: "17 a 104m²",
      banheiros: 1,
      quartos: "studio a 2",
      vagas: 1,
      valorInicial: 143970.00,
      imagem: "assets/img/empre_02.png"
    },
    {
      titulo: "Residencial Vitória",
      status: "Em construção",
      cidade: "São Paulo",
      Bairro: "Piriruba",
      metragem: "17 a 104m²",
      banheiros: 1,
      quartos: "studio a 2",
      vagas: 1,
      valorInicial: 143970.00,
      imagem: "assets/img/empre_01.jpg"
    },
    {
      titulo: "Residencial Vitória",
      status: "Lançamento",
      cidade: "São Paulo",
      Bairro: "Piriruba",
      metragem: "17 a 104m²",
      banheiros: 1,
      quartos: "studio a 2",
      vagas: 1,
      valorInicial: 143970.00,
      imagem: "assets/img/empre_03.png"
    },
    {
      titulo: "Residencial Vitória",
      status: "Em construção",
      cidade: "São Paulo",
      Bairro: "Piriruba",
      metragem: "17 a 104m²",
      banheiros: 1,
      quartos: "studio a 2",
      vagas: 1,
      valorInicial: 143970.00,
      imagem: "assets/img/empre_04.png"
    },
    {
      titulo: "Residencial Vitória",
      status: "Em construção",
      cidade: "São Paulo",
      Bairro: "Piriruba",
      metragem: "17 a 104m²",
      banheiros: 1,
      quartos: "studio a 2",
      vagas: 1,
      valorInicial: 143970.00,
      imagem: "assets/img/empre_03.png"
    },
    {
      titulo: "Residencial Vitória",
      status: "Lançamento",
      cidade: "São Paulo",
      Bairro: "Piriruba",
      metragem: "17 a 104m²",
      banheiros: 1,
      quartos: "studio a 2",
      vagas: 1,
      valorInicial: 143970.00,
      imagem: "assets/img/empre_02.png"
    },
    {
      titulo: "Residencial Vitória",
      status: "Lançamento",
      cidade: "São Paulo",
      Bairro: "Piriruba",
      metragem: "17 a 104m²",
      banheiros: 1,
      quartos: "studio a 2",
      vagas: 1,
      valorInicial: 143970.00,
      imagem: "assets/img/empre_03.png"
    }
  ];

  constructor(private router: Router) {}

  onSubmit(){
    console.log(this.incialSearchForm.value);
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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

  navegarParaDetalhe(empreendimento: Empreendimento): void {
    this.router.navigate(['/empreendimento']);
  }

  goToPage(index: number): void {
    this.index = index;
  }

}