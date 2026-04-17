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
import { Empreendimento } from '../../../shared/models/empreendimento.model';
import { EmpreendimentoService } from '../../../shared/service/empreendimento.service';

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

  empreendimento!: DetalheEmpreendimento;

  contatoAberto = false;
  id = '69a9f9d0c1f0792c830ae965';

  constructor(private service: EmpreendimentoService) {}

  ngOnInit(): void {
    this.getEmpreendimento(this.id);
  }

  getEmpreendimento(id: string) {
    this.service.getDetalhe(id).subscribe({
      next: (data) => {
        this.empreendimento = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

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
