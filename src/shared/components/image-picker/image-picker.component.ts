import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, TuiButton]
})
export class ImagePickerComponent {
  @Input() label: string = 'Selecionar Imagem';
  @Input() multiple: boolean = false;
  @Input() previewImages: string[] = [];
  @Output() imageSelected = new EventEmitter<string | string[]>();

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
    this.imageSelected.emit(this.multiple ? this.previewImages : this.previewImages[0] || '');
  }

  clearImages() {
    this.previewImages = [];
    this.imageSelected.emit(this.multiple ? [] : '');
  }
}
