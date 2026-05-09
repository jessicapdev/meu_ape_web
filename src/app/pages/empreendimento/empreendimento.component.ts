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
import { Timeline } from './models/timeline.model';

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
    TuiLoader
  ],
  templateUrl: './empreendimento.component.html',
  styleUrl: './empreendimento.component.scss'
})
export class EmpreendimentoComponent {
  private readonly API_URL = 'http://localhost:8080/api/empreendimentos';

  endereco: string = '';
  empreendimento!: DetalheEmpreendimento;
  id: string = '';
  contatoAberto = false;
  loading = true;
  timeline: Timeline[] = [
      { "ordem": 1, "titulo": "Breve Lançamento", "data": null, "completado": false},
      { "ordem": 2, "titulo": "Lançamento", "data": null, "completado": false },
      { "ordem": 3, "titulo": "Em Construção", "data": null, "completado": false },
      { "ordem": 4, "titulo": "Pronto", "data": null, "completado": false }
  ];

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

  public montarUrl(id: string): string {
    return `${this.API_URL}/${id}/imagens`;
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
        this.timeline = this.empreendimento.timeline || this.timeline;
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
