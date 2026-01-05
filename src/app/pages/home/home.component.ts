import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDropdown, TuiDropdownDirective, TuiDropdownOpen, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalQuartosComponent } from '../../../shared/components/modal-quartos/modal-quartos.component';
import { ModalStatusComponent } from '../../../shared/components/modal-status/modal-status.component';
import { ModalPrecoComponent } from '../../../shared/components/modal-preco/modal-preco.component';
import { ModalFiltrarComponent } from '../../../shared/components/modal-filtrar/modal-filtrar.component';
import { TuiBadge, TuiCarousel, TuiChevron } from '@taiga-ui/kit';
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

  protected incialSearchForm = new FormGroup({
    local: new FormControl('')
  })

  index = 0;
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
      imagem: "https://www.allflex.global/br/wp-content/uploads/sites/11/2023/10/ALICATE.png?resize=220,120%20220w,%20https://www.allflex.global/br/wp-content/uploads/sites/11/2023/10/ALICATE.png?resize=720,393%20720w"
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
      imagem: "../../../asset/img/empre_01.jpg"
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
      imagem: "asset/img/empre_01.jpg"
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
      imagem: "asset/img/empre_01.jpg"
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
      imagem: "asset/img/empre_01.jpg"
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
      imagem: "asset/img/empre_01.jpg"
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
      imagem: "asset/img/empre_01.jpg"
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
    this.router.navigate(['/empreendimento', empreendimento.titulo.toLowerCase().replace(/\s+/g, '-')]);
  }

}