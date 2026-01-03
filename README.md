# PortalMeuApe

Componente modal para seleção de quartos utilizando Taiga UI 4.60.0 e Angular 19.2.15.

## 📦 Instalação

### 1. Instalar dependências necessárias

```bash
npm install @taiga-ui/core@4.60.0 @taiga-ui/kit@4.60.0 @taiga-ui/cdk@4.60.0
npm install @tinkoff/ng-polymorpheus
```

### 2. Configurar estilos

Adicione os estilos do Taiga UI no seu `angular.json`:

```json
{
  "projects": {
    "your-project": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@taiga-ui/core/styles/taiga-ui-theme.less",
              "node_modules/@taiga-ui/core/styles/taiga-ui-fonts.less",
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
}
```
## Modal Quartos

### 🚀 Uso

### 1. Importar o serviço

```typescript
import { QuartosModalService } from './quartos-modal.service';

export class MeuComponente {
  constructor(private quartosModalService: QuartosModalService) {}
}
```

### 2. Abrir o modal

```typescript
// Abrir modal sem seleção inicial
this.quartosModalService.open().subscribe(result => {
  console.log('Quartos selecionados:', result.quartos);
});

// Abrir modal com seleção inicial
const quartosInicial = ['1', '2'];
this.quartosModalService.open(quartosInicial).subscribe(result => {
  this.quartosSelecionados = result.quartos;
});
```

### 3. Estrutura do resultado

```typescript
interface QuartosModalResult {
  quartos: string[]; // Array com os quartos selecionados
}
```

### Funcionalidades
- ✅ Seleção múltipla de quartos
- ✅ Visualização clara dos itens selecionados
- ✅ Botão "Limpar filtro" para remover todas as seleções
- ✅ Botão "Aplicar" para confirmar a seleção
- ✅ Fechamento do modal ao clicar fora
- ✅ Animações suaves

## 🔧 Solução de Problemas

### Erro: "Cannot find module '@taiga-ui/core'"
Verifique se as dependências estão instaladas corretamente:
```bash
npm install @taiga-ui/core@4.60.0 @taiga-ui/kit@4.60.0
```

### Erro: "No provider for TuiDialogService"
Certifique-se de importar `TuiDialogModule` no módulo:
```typescript
imports: [TuiDialogModule]
```

### Erro: "Cannot find module '@tinkoff/ng-polymorpheus'"
Instale a dependência:
```bash
npm install @tinkoff/ng-polymorpheus
```

## 📄 Licença

Este componente segue as diretrizes do Taiga UI e pode ser utilizado em projetos comerciais e open source.

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novos recursos!
