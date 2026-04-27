import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { EmpreendimentoService } from '../../../../../shared/service/empreendimento.service';
import { ImagePickerComponent } from '../../../../../shared/components/image-picker/image-picker.component';
import { TuiButton } from '@taiga-ui/core';
import { EmpreendimentoPerfil } from '../../../empreendimento/models/detalhe-empreendimento.model';

@Component({
  selector: 'app-modal-imagem',
  templateUrl: './modal-imagem.component.html',
  styleUrls: ['./modal-imagem.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ImagePickerComponent,
    TuiButton
  ]
})
export class ModalImagemComponent implements OnInit, OnChanges {

  @Input() mostrarModal: boolean = false;
  @Input() formulario!: FormGroup;
  @Input() id!: string;
  @Input() empreendimento: EmpreendimentoPerfil = {} as EmpreendimentoPerfil;

  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  @ViewChild('bannerPicker') bannerPicker!: ImagePickerComponent;
  @ViewChild('mapPicker') mapPicker!: ImagePickerComponent;
  @ViewChild('plantasPicker') plantasPicker!: ImagePickerComponent;
  @ViewChild('galeriaPicker') galeriaPicker!: ImagePickerComponent;

  protected imagens = {
    banner: '',
    map: '',
    plantas: [] as string[],
    galeria: [] as string[]
  };

  protected previewBanner: string[] = [];
  protected previewMap: string[] = [];
  protected previewPlantas: string[] = [];
  protected previewGaleria: string[] = [];

  constructor(private empreendimentoService: EmpreendimentoService) { }

  ngOnInit() {
    // Inicialização, carregamento das imagens será feito em ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mostrarModal'] && this.mostrarModal && this.id) {
      this.getImagensByEmpreendimento();
    }
  }

  getImagensByEmpreendimento() {
    this.empreendimentoService.getImagensByEmpreendimento(this.id).subscribe(imagens => {
      const { banner, map, plantas, galeria } = imagens?.imagens || {};
      this.imagens.banner = banner || '';
      this.imagens.map = map || '';
      this.imagens.plantas = plantas || [];
      this.imagens.galeria = galeria || [];
      this.previewBanner = banner ? [banner] : [];
      this.previewMap = map ? [map] : [];
      this.previewPlantas = [...(plantas || [])];
      this.previewGaleria = [...(galeria || [])];
    });   
  }

  onBannerSelected(imagemBase64: string | string[]) {
    if (typeof imagemBase64 === 'string') {
      this.imagens.banner = imagemBase64;
      this.previewBanner = imagemBase64 ? [imagemBase64] : [];
    }
  }

  onMapSelected(imagemBase64: string | string[]) {
    if (typeof imagemBase64 === 'string') {
      this.imagens.map = imagemBase64;
      this.previewMap = imagemBase64 ? [imagemBase64] : [];
    }
  }

  onPlantasSelected(imagensBase64: string | string[]) {
    if (Array.isArray(imagensBase64)) {
      if (imagensBase64.length === 0) {
        // Se receber array vazio, é uma limpeza do componente filho
        this.imagens.plantas = [];
        this.previewPlantas = [];
      } else {
        // Verificar se são novas imagens ou se é o resultado de uma remoção
        // Se o tamanho mudou, pode ser remoção ou adição
        const novasImagens = imagensBase64.filter(img => !this.imagens.plantas.includes(img));
        if (novasImagens.length > 0) {
          // Adicionando novas imagens
          this.imagens.plantas = [...this.imagens.plantas, ...novasImagens];
          this.previewPlantas = [...this.previewPlantas, ...novasImagens];
        } else {
          // Removendo imagens (quando clica em remover no preview)
          this.imagens.plantas = imagensBase64;
          this.previewPlantas = imagensBase64;
        }
      }
    }
  }

  onGaleriaSelected(imagensBase64: string | string[]) {
    if (Array.isArray(imagensBase64)) {
      if (imagensBase64.length === 0) {
        // Se receber array vazio, é uma limpeza do componente filho
        this.imagens.galeria = [];
        this.previewGaleria = [];
      } else {
        // Verificar se são novas imagens ou se é o resultado de uma remoção
        const novasImagens = imagensBase64.filter(img => !this.imagens.galeria.includes(img));
        if (novasImagens.length > 0) {
          // Adicionando novas imagens
          this.imagens.galeria = [...this.imagens.galeria, ...novasImagens];
          this.previewGaleria = [...this.previewGaleria, ...novasImagens];
        } else {
          // Removendo imagens (quando clica em remover no preview)
          this.imagens.galeria = imagensBase64;
          this.previewGaleria = imagensBase64;
        }
      }
    }
  }

  getImagensFormatadas() {
    return {
      banner: this.imagens.banner,
      map: this.imagens.map,
      plantas: this.imagens.plantas,
      galeria: this.imagens.galeria
    };
  }

  clearAllImages() {
    this.imagens = {
      banner: '',
      map: '',
      plantas: [],
      galeria: []
    };
    this.previewBanner = [];
    this.previewMap = [];
    this.previewPlantas = [];
    this.previewGaleria = [];

    // Limpar os componentes filhos
    if (this.bannerPicker) this.bannerPicker.clearImages();
    if (this.mapPicker) this.mapPicker.clearImages();
    if (this.plantasPicker) this.plantasPicker.clearImages();
    if (this.galeriaPicker) this.galeriaPicker.clearImages();
  }

  isFormValid(): boolean {
    const requiredImages = !!(this.imagens.banner && this.imagens.map);
    return requiredImages;
  }

  onFecharModal(){
    this.fecharModal.emit();
  }

  onSalvar(){
    if (!this.isFormValid()) {
      console.error('Formulário inválido. Preencha todos os campos obrigatórios.');
      return;
    }

    const formData = this.getImagensFormatadas();
    this.empreendimentoService.atualizarImagem(this.id, formData).subscribe({
      next: () => {
        this.clearAllImages();
        this.salvar.emit(formData);
      },
      error: (erro: any) => {
        console.error('Erro ao atualizar imagens:', erro);
      }
    });
  }
}
