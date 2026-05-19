import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, TuiButton, FormsModule]
})
export class ImagePickerComponent {
  @Input() label: string = 'Selecionar Imagem';
  @Input() multiple: boolean = false;
  @Input() previewImages: string[] = [];
  @Input() enableDescription: boolean = false;
  @Input() enableTitle: boolean = false;
  @Input() imageDescriptions: Record<number, string> = {};
  @Input() imageTitles: Record<number, string> = {};
  @Output() imageSelected = new EventEmitter<string | string[]>();
  @Output() descriptionsChanged = new EventEmitter<Record<number, string>>();
  @Output() titlesChanged = new EventEmitter<Record<number, string>>();

  fileInput: HTMLInputElement | null = null;

  openFileDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = this.multiple;

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (files) {
        if (this.multiple) {
          const imagesBase64: string[] = [];
          let processedFiles = 0;

          Array.from(files).forEach((file) => {
            this.convertToBase64(file, (base64) => {
              imagesBase64.push(base64);
              processedFiles++;

              if (processedFiles === files.length) {
                this.previewImages = imagesBase64;
                this.imageSelected.emit(imagesBase64);
              }
            });
          });
        } else {
          const file = files[0];
          this.convertToBase64(file, (base64) => {
            this.previewImages = [base64];
            this.imageSelected.emit(base64);
          });
        }
      }
    };

    input.click();
  }

  private convertToBase64(file: File, callback: (base64: string) => void) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      callback(base64);
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
    // Remove a descrição associada
    delete this.imageDescriptions[index];
    // Remove o título associado
    delete this.imageTitles[index];
    // Reindexar descrições e títulos após remoção
    const reindexedDescriptions: Record<number, string> = {};
    const reindexedTitles: Record<number, string> = {};
    Object.entries(this.imageDescriptions).forEach(([key, value]) => {
      const oldIndex = parseInt(key);
      if (oldIndex > index) {
        reindexedDescriptions[oldIndex - 1] = value;
      } else if (oldIndex < index) {
        reindexedDescriptions[oldIndex] = value;
      }
    });
    Object.entries(this.imageTitles).forEach(([key, value]) => {
      const oldIndex = parseInt(key);
      if (oldIndex > index) {
        reindexedTitles[oldIndex - 1] = value;
      } else if (oldIndex < index) {
        reindexedTitles[oldIndex] = value;
      }
    });
    this.imageDescriptions = reindexedDescriptions;
    this.imageTitles = reindexedTitles;
    this.imageSelected.emit(this.multiple ? this.previewImages : this.previewImages[0] || '');
    this.descriptionsChanged.emit(this.imageDescriptions);
    this.titlesChanged.emit(this.imageTitles);
  }

  clearImages() {
    this.previewImages = [];
    this.imageDescriptions = {};
    this.imageTitles = {};
    this.imageSelected.emit(this.multiple ? [] : '');
    this.descriptionsChanged.emit(this.imageDescriptions);
    this.titlesChanged.emit(this.imageTitles);
  }

  updateDescription(index: number, description: string) {
    this.imageDescriptions[index] = description;
    this.descriptionsChanged.emit(this.imageDescriptions);
  }

  updateTitle(index: number, title: string) {
    this.imageTitles[index] = title;
    this.titlesChanged.emit(this.imageTitles);
  }
}
