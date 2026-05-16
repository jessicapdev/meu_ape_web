import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { EmpreendimentoService } from '../../../../../shared/service/empreendimento.service';
import { ImagePickerComponent } from '../../../../../shared/components/image-picker/image-picker.component';
import { TuiButton } from '@taiga-ui/core';
import { EmpreendimentoPerfil } from '../../../empreendimento/models/detalhe-empreendimento.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-modal-imagem',
  templateUrl: './modal-imagem.component.html',
  styleUrls: ['./modal-imagem.component.scss'],
  standalone: true,
  imports: [CommonModule, ImagePickerComponent, TuiButton]
})
export class ModalImagemComponent implements OnInit, OnChanges {
  @Input() mostrarModal: boolean = false;
  @Input() formulario!: FormGroup;
  @Input() id!: string;
  @Input() empreendimento: EmpreendimentoPerfil = {} as EmpreendimentoPerfil;

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

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

  private readonly API_URL = `${environment.apiUrl}/empreendimentos`;

  constructor(private empreendimentoService: EmpreendimentoService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mostrarModal'] && this.mostrarModal && this.id) {
      this.carregarDadosIniciais();
    }
  }

  private carregarDadosIniciais() {
    this.previews.banner = [this.montarUrl(this.empreendimento.imagens.banner)];
    this.previews.map = [this.montarUrl(this.empreendimento.imagens.map)];
    this.previews.plantas = this.empreendimento.imagens.plantas.map(id => this.montarUrl(id));
    this.previews.galeria = this.empreendimento.imagens.galeria.map(id => this.montarUrl(id));
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

  public isFormValid(): boolean {
    if (!this.previews.banner || !this.previews.map) return false;
    return this.previews.banner.length > 0 && this.previews.map.length > 0;
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

  onSalvar() {
    const formData = new FormData();
    if (this.novosArquivos.banner) formData.append('banner', this.novosArquivos.banner, 'banner.webp');
    if (this.novosArquivos.map) formData.append('mapa', this.novosArquivos.map, 'mapa.webp');
    
    this.novosArquivos.plantas.forEach((b, i) => b && formData.append('plantas', b, `p_${i}.webp`));
    this.novosArquivos.galeria.forEach((b, i) => b && formData.append('galeria', b, `g_${i}.webp`));

    formData.append('configuracao', JSON.stringify({
      manterBanner: !this.novosArquivos.banner, 
      manterMap: !this.novosArquivos.map,
      idsMantidosPlantas: this.idsExistentes.plantas.filter(id => this.previews.plantas.includes(this.montarUrl(id))),
      idsMantidosGaleria: this.idsExistentes.galeria.filter(id => this.previews.galeria.includes(this.montarUrl(id)))
    }));

    this.empreendimentoService.atualizarImagem(this.id, formData).subscribe({
      next: () => {
        this.salvar.emit();
        this.fecharModal.emit();
      }
    });
  }

  onFecharModal(){
    this.fecharModal.emit();
  }

}