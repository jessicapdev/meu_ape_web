import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiButton, TuiIcon, TuiIcons, TuiLoader, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { TuiAccordion, TuiBadge, TuiCarousel, TuiCarouselButtons } from '@taiga-ui/kit';
import { DetalheEmpreendimento } from './models/detalhe-empreendimento.model';
import { RouterLink } from '@angular/router';
import { TuiTable, TuiTableControl} from '@taiga-ui/addon-table';
import { TuiCard } from '@taiga-ui/layout';
import { TuiItem } from '@taiga-ui/cdk/directives/item';
import { Empreendimento } from '../../../shared/models/empreendimento.model';
import { EmpreendimentoService } from '../../../shared/service/empreendimento.service';
import { finalize } from 'rxjs';

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
    TuiLoader,
    RouterLink,
  ],
  templateUrl: './empreendimento.component.html',
  styleUrl: './empreendimento.component.scss'
})
export class EmpreendimentoComponent {
  endereco: string = '';
  empreendimento!: DetalheEmpreendimento;
  id: string = '';
  contatoAberto = false;
  loading = true;
  timeline = [
    { "ordem": 1, "titulo": "Breve Lançamento", "data": null, "completado": true },
    { "ordem": 2, "titulo": "Lançamento", "data": "Maio 2021", "completado": true },
    { "ordem": 3, "titulo": "Em Construção", "data": null, "completado": true },
    { "ordem": 4, "titulo": "Pronto", "data": "Dezembro 2023", "completado": false }
  ]

  constructor(
    private service: EmpreendimentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.getEmpreendimento(this.id);
      }
    });
  }

  getEmpreendimento(id: string) {
    this.service.getDetalhe(id)
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: (data) => {
        this.empreendimento = data;
        this.endereco = `${this.empreendimento.endereco}, ${this.empreendimento.bairro}, ${this.empreendimento.cidade}`;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  abrirContato() {
    this.router.navigate(['/contato']);
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

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
