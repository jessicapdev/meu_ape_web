import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { EmpreendimentoService } from '../../../../../shared/service/empreendimento.service';
import { ImagePickerComponent } from '../../../../../shared/components/image-picker/image-picker.component';
import { TuiButton } from '@taiga-ui/core';
import { EmpreendimentoPerfil } from '../../../empreendimento/models/detalhe-empreendimento.model';
import { environment } from '../../../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-imagem',
  templateUrl: './modal-imagem.component.html',
  styleUrls: ['./modal-imagem.component.scss'],
  standalone: true,
  imports: [CommonModule, ImagePickerComponent, TuiButton]
})
export class ModalImagemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mostrarModal: boolean = false;
  @Input() formulario!: FormGroup;
  @Input() id!: string;
  @Input() empreendimento: EmpreendimentoPerfil = {} as EmpreendimentoPerfil;

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  // Armazena as URLs de preview (Seja do Backend ou Base64 local)
  public previews: Record<'banner' | 'map' | 'plantas' | 'galeria', string[]> = {
    banner: [],
    map: [],
    plantas: [],
    galeria: []
  }

  public novosArquivos = {
    banner: null as Blob | null,
    map: null as Blob | null,
    plantas: [] as Blob[],
    galeria: [] as Blob[]
  };

  public idsExistentes = {
    banner: null as string | null,
    map: null as string | null,
    plantas: [] as string[],
    galeria: [] as string[]
  };

  public descriptions: Record<'banner' | 'map' | 'plantas' | 'galeria', Record<number, string>> = {
    banner: {},
    map: {},
    plantas: {},
    galeria: {}
  };

  public titles: Record<'banner' | 'map' | 'plantas' | 'galeria', Record<number, string>> = {
    banner: {},
    map: {},
    plantas: {},
    galeria: {}
  };

  private readonly API_URL = `${environment.apiUrl}/empreendimentos`;

  constructor(private empreendimentoService: EmpreendimentoService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mostrarModal'] && this.mostrarModal && this.id) {
      this.carregarDadosIniciais();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private carregarDadosIniciais() {
    this.carregarImagemSingular('banner');
    this.carregarImagemSingular('map');
    this.carregarImagensArray('plantas');
    this.carregarImagensArray('galeria');
  }

  private carregarImagemSingular(tipo: 'banner' | 'map'): void {
    const imagem = this.empreendimento.imagens[tipo];
    if (!imagem) return;

    this.previews[tipo] = [this.montarUrl(imagem.fileId)];
    this.idsExistentes[tipo] = imagem.fileId;
    this.titles[tipo][0] = imagem.titulo || '';
    this.descriptions[tipo][0] = imagem.descricao || '';
  }

  private carregarImagensArray(tipo: 'plantas' | 'galeria'): void {
    const imagens = this.empreendimento.imagens[tipo] || [];
    
    this.previews[tipo] = imagens.map(item => this.montarUrl(item.fileId));
    this.idsExistentes[tipo] = imagens.map(item => item.fileId);
    
    imagens.forEach((item, i) => {
      this.titles[tipo][i] = item.titulo || '';
      this.descriptions[tipo][i] = item.descricao || '';
    });
  }

  private montarUrl(id: string): string {
    return `${this.API_URL}/${id}/imagens`;
  }

  async handleSelection(tipo: 'banner' | 'map' | 'plantas' | 'galeria', data: string | string[]) {
    if (Array.isArray(data)) {
      this.previews[tipo] = data; 
      const novos = await Promise.all(data.filter(d => d.startsWith('data:')).map(b64 => this.convertBase64ToWebP(b64)));
      (this.novosArquivos[tipo] as Blob[]) = novos;
    } else {
      this.previews[tipo] = data ? [data] : [];
      if (data.startsWith('data:')) {
        const novo = await this.convertBase64ToWebP(data);
        (this.novosArquivos[tipo] as Blob | null) = novo;
      }
    }
  }

  handleDescriptionsChange(tipo: 'banner' | 'map' | 'plantas' | 'galeria', descriptions: Record<number, string>) {
    this.descriptions[tipo] = descriptions;
  }

  handleTitlesChange(tipo: 'banner' | 'map' | 'plantas' | 'galeria', titles: Record<number, string>) {
    this.titles[tipo] = titles;
  }

  public isFormValid(): boolean {
    if (!this.previews.banner || !this.previews.map) return false;
    if (this.previews.banner.length === 0 || this.previews.map.length === 0) return false;
    
    // Validar que todas as plantas têm um título preenchido
    if (this.previews.plantas.length > 0) {
      for (let i = 0; i < this.previews.plantas.length; i++) {
        if (!this.titles.plantas[i] || this.titles.plantas[i].trim() === '') {
          return false;
        }
      }
    }
    
    return true;
  }

  private obterIdsExistentes(tipo: 'plantas' | 'galeria'): string[] {
    return this.idsExistentes[tipo].filter(id => 
      this.previews[tipo].includes(this.montarUrl(id))
    );
  }

  private obterReference(tipo: 'banner' | 'map' | 'plantas' | 'galeria', indice: number): string {
    const preview = this.previews[tipo][indice];
    
    // Se for URL do backend (começa com http), retorna o fileId (reference antigo)
    if (preview?.startsWith('http')) {
      if (tipo === 'banner' || tipo === 'map') {
        return this.idsExistentes[tipo] as string;
      } else {
        // Para arrays, procurar qual ID corresponde a essa preview
        const id = this.idsExistentes[tipo].find(id => this.montarUrl(id) === preview);
        return id || '';
      }
    }
    
    // Se for nova (data URL), retorna o nome do arquivo conforme anexado no FormData
    const nomeArquivo = this.obterNomeArquivoNovo(tipo, indice);
    return nomeArquivo;
  }

  private obterNomeArquivoNovo(tipo: string, indice: number): string {
    switch (tipo) {
      case 'banner':
        return 'banner.webp';
      case 'map':
        return 'mapa.webp';
      case 'plantas':
        return `p_${indice}.webp`;
      case 'galeria':
        return `g_${indice}.webp`;
      default:
        return '';
    }
  }

  private construirMetadadosImagemSingular(tipo: 'banner' | 'map'): Record<string, any> {
    return {
      reference: this.obterReference(tipo, 0),
      titulo: this.titles[tipo][0] || '',
      descricao: this.descriptions[tipo][0] || ''
    };
  }

  private construirMetadadosArray(tipo: 'plantas' | 'galeria'): Record<string, any>[] {
    const metadadosArray = [];
    const count = this.previews[tipo].length;

    for (let i = 0; i < count; i++) {
      metadadosArray.push({
        reference: this.obterReference(tipo, i),
        titulo: this.titles[tipo][i] || '',
        descricao: this.descriptions[tipo][i] || ''
      });
    }
    return metadadosArray;
  }

  private construirConfiguracao(): Record<string, any> {
    return {
      manterBanner: !this.novosArquivos.banner,
      bannerMeta: this.construirMetadadosImagemSingular('banner'),
      
      manterMap: !this.novosArquivos.map,
      mapMeta: this.construirMetadadosImagemSingular('map'),
      
      plantasMantidas: this.obterIdsExistentes('plantas'),
      plantasMeta: this.construirMetadadosArray('plantas'),
      
      galeriaMantida: this.obterIdsExistentes('galeria'),
      galeriaMeta: this.construirMetadadosArray('galeria')
    };
  }

  private anexarArquivosFormData(formData: FormData): void {
    if (this.novosArquivos.banner) {
      formData.append('banner', this.novosArquivos.banner, 'banner.webp');
    }
    if (this.novosArquivos.map) {
      formData.append('mapa', this.novosArquivos.map, 'mapa.webp');
    }

    this.novosArquivos.plantas.forEach((blob, i) => {
      if (blob) formData.append('plantas', blob, `p_${i}.webp`);
    });

    this.novosArquivos.galeria.forEach((blob, i) => {
      if (blob) formData.append('galeria', blob, `g_${i}.webp`);
    });
  }

  onSalvar() {
    if (!this.isFormValid()) {
      console.warn('Formulário inválido. Verifique as imagens e títulos.');
      return;
    }

    const formData = new FormData();
    this.anexarArquivosFormData(formData);
    
    // Adicionar configuração como @RequestPart (JSON com Content-Type application/json)
    const configBlob = new Blob([JSON.stringify(this.construirConfiguracao())], {
      type: 'application/json'
    });
    formData.append('config', configBlob);

    this.empreendimentoService.atualizarImagem(this.id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.salvar.emit();
          this.fecharModal.emit();
        },
        error: (erro) => {
          console.error('Erro ao atualizar imagens:', erro);
        }
      });
  }

  public async convertBase64ToWebP(base64: string): Promise<Blob> {
    if (base64.startsWith('http')) return null as any; 
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(), 'image/webp', 0.85);
      };
      img.src = base64;
    });
  }

  onFecharModal(){
    this.fecharModal.emit();
  }

}