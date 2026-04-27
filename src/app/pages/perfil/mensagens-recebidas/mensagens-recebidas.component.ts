import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CdkTableModule } from '@angular/cdk/table';
import { TuiButton } from '@taiga-ui/core';
import { TuiCheckbox, TuiPagination } from '@taiga-ui/kit';
import { Contato } from '../../../../shared/models/contato.model';
import { ContatoService } from '../../../../shared/service/contato.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageResponse } from '../../../../shared/models/page-response.model';

@Component({
  selector: 'app-mensagens-recebidas',
  standalone: true,
  imports: [
    CommonModule,
    CdkTableModule, 
    FormsModule, 
    ReactiveFormsModule,
    TuiButton, 
    TuiCheckbox,
    TuiPagination
  ],
  templateUrl: './mensagens-recebidas.component.html',
  styleUrls: ['./mensagens-recebidas.component.scss'],
})
export class MensagensRecebidasComponent implements OnInit {
  contatos: Contato[] = [];
  readonly displayedColumns = ['select', 'nome', 'assunto', 'dataRecebimento', 'status', 'action'];
  selectedIds = new Set<string>();
  selectedContact: Contato | null = null;
  showDetailModal = false;
  loading = false;
  paginaAtual = 0;
  tamanho = 10;
  totalPaginas = 0;
  totalElementos = 0;

  constructor(private contatoService: ContatoService) {}

  ngOnInit(): void {
    this.loadContatos();
  }

  loadContatos(): void {
    this.loading = true;
    this.contatoService.getContatos(this.paginaAtual, this.tamanho)
      .pipe(catchError(() => of(this.contatos = [])))
      .subscribe((resposta: any) => {
        this.contatos = resposta.content.map((contato: Contato) => ({
          ...contato,
          lido: contato.lido ?? false,
        }));
        this.totalPaginas = resposta.totalPages;
        this.totalElementos = resposta.totalElements;
        this.loading = false;
      });
  }

  isSelected(contato: Contato): boolean {
    return Boolean(contato.id && this.selectedIds.has(contato.id));
  }

  get allSelected(): boolean {
    return this.contatos.length > 0 && this.contatos.every((contato) => contato.id ? this.selectedIds.has(contato.id) : false);
  }

  hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  toggleSelection(contato: Contato, checked: any): void {
    if (!contato.id) {
      return;
    }

    if (checked) {
      this.selectedIds.add(contato.id);
    } else {
      this.selectedIds.delete(contato.id);
    }
  }

  toggleSelectAll(checked: any): void {
    if (checked) {
      this.contatos.forEach((contato) => {
        if (contato.id) {
          this.selectedIds.add(contato.id);
        }
      });
    } else {
      this.selectedIds.clear();
    }
  }

  markSelectedAsLido(value: boolean): void {
    const selected = this.contatos.filter((contato) => contato.id && this.selectedIds.has(contato.id));
    if (!selected.length) {
      return;
    }

    forkJoin(
      selected.map((contato) =>
        this.contatoService.updateContato(contato.id as string, value).pipe(
          catchError(() => of(null))
        )
      )
    ).subscribe(() => {
      selected.forEach((contato) => {
        contato.lido = value;
      });
      this.selectedIds.clear();
    });
  }

  openMensagem(contato: Contato): void {
    this.selectedContact = contato;
    this.showDetailModal = true;

    if (contato.id && !contato.lido) {
      this.contatoService.updateStatusContato(contato.id, true).subscribe(() => {
        contato.lido = true;
      });
    }
  }

  closeModal(): void {
    this.showDetailModal = false;
    this.selectedContact = null;
  }

  formatDate(date?: string): string {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onPageChange(index: number): void {
    this.paginaAtual = index;
    this.selectedIds.clear(); // Limpa seleções ao mudar de página para evitar confusão
    this.loadContatos();
  }
}
