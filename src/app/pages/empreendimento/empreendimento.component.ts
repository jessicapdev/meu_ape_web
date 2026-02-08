import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiButton, TuiIcon, TuiIcons, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { TuiAccordion, TuiBadge, TuiCarousel, TuiCarouselButtons } from '@taiga-ui/kit';
import { DetalheEmpreendimento } from './models/detalhe-empreendimento.model';
import { RouterLink } from '@angular/router';
import { TuiTable, TuiTableControl} from '@taiga-ui/addon-table';
import { TuiCard } from '@taiga-ui/layout';
import { TuiItem } from '@taiga-ui/cdk/directives/item';

@Component({
  selector: 'app-empreendimento',
  standalone: true,
  imports: [
    CommonModule,
    TuiCard,
    TuiAccordion,
    TuiRoot,
    TuiButton,
    TuiIcon,
    TuiIcons,
    TuiBadge,
    TuiTitle,
    TuiTable,
    TuiItem,
    TuiTableControl,
    TuiAccordion,
    TuiCarousel,
    TuiCarouselButtons,
    TuiCurrencyPipe,
    RouterLink,
  ],
  templateUrl: './empreendimento.component.html',
  styleUrl: './empreendimento.component.scss'
})
export class EmpreendimentoComponent {
  imageUrl: string = 'https://via.placeholder.com/600x400/3F51B5/FFFFFF?text=Localização+do+Endereço';
  altText: string = 'Imagem do local do endereço';
  endereco: string = 'Av. Paulista, 1000, São Paulo - SP, Brasil';

  empreendimento = {
    titulo: "Residencial Vitória",
    status: "Pronto para morar",
    cidade: "São Paulo",
    bairro: "Piriruba",
    metragem: "17 a 104m²",
    banheiros: 1,
    quartos: "studio a 2",
    vagas: 1,
    valorInicial: "143.970,00",
    imagens: {
      banner: "assets/img/empre_03.png",
      map: "assets/img/maps.png",
      plantas: [],
      galeria: []
     },
    apartamentos: [
      {
        tipo: "Studio",
        area: "17 m²",
        quartos: "-",
        suites: "-",
        banheiros: 1,
        vagas: "-",
        preco: 148979.13
      },
      {
        tipo: "Apto",
        area: "25 m²",
        quartos: "1",
        suites: "-",
        banheiros: 1,
        vagas: "-",
        preco: null
      },
      {
        tipo: "Apto",
        area: "33 m²",
        quartos: "2",
        suites: "-",
        banheiros: 1,
        vagas: "1",
        preco: null
      },
      {
        tipo: "Apto/Penthouse",
        area: "60 m²",
        quartos: "1",
        suites: "-",
        banheiros: 1,
        vagas: "1",
        preco: null
      },
      {
        tipo: "Apto/Duplex",
        area: "104 m²",
        quartos: "1",
        suites: "-",
        banheiros: 1,
        vagas: "1",
        preco: null
      }
    ],
    diferenciais: [
      { nome: 'Perto de metrô/trem'},
      { nome: 'Perto de parque'},
      { nome: 'Perto de academia'},
      { nome: 'Torre única'},
      { nome: 'Perto de mercado'},
      { nome: 'Pet place'},
      { nome: 'Bicicletário'},
    ],
    areasLazer: [
      { nome: 'Perto de metrô/trem'},
      { nome: 'Perto de parque'},
      { nome: 'Perto de academia'},
      { nome: 'Torre única'},
      { nome: 'Perto de mercado'},
      { nome: 'Pet place'},
      { nome: 'Bicicletário'},
    ],
    descricao: "Metrocasa Pirituba - More a 600 m da estação Pirituba do metrô!",
    views: 1315,
    dias: 90,
  } as DetalheEmpreendimento;

  contatoAberto = false;

  abrirContato() {
    console.log('Abrir contato');
    this.contatoAberto = true;
  }

  agendarVisita() {
    console.log('Agendar visita');
  }

  getGoogleMapsUrl(): string {
    const enderecoCodificado = encodeURIComponent(this.endereco);
    return `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`;
  }

  redirecionarParaGoogleMaps(): void {
    window.open(this.getGoogleMapsUrl(), '_blank');
  }
}
