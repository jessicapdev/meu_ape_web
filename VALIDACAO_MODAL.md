# Documentação de Validação - Modal Empreendimento

## Estrutura do JSON gerado

Quando o usuário preenche o formulário e clica em "Criar/Atualizar", o seguinte JSON é gerado:

```json
{
    "titulo": "Nome do Empreendimento",
    "tiposImoveis": "Tipo selecionado",
    "status": { "label": "Ativo", "value": "ativo" },
    "cidade": "São Paulo",
    "bairro": "Carrão",
    "areaMin": 40,
    "areaMax": 60,
    "banheiros": ["1", "2", "3"],
    "quartos": ["Studio", "1", "2"],
    "vagas": ["1", "2"],
    "precoMin": 400000,
    "precoMax": 600000,
    "descricao": "Descrição opcional",
    "diferenciais": ["Piscina", "Academia"],
    "apartamentos": [],
    "imagens": {
        "banner": "data:image/png;base64,...",
        "map": "data:image/png;base64,...",
        "plantas": ["data:image/png;base64,..."],
        "galeria": ["data:image/png;base64,..."]
    }
}
```

## Campos Obrigatórios

Os seguintes campos são **OBRIGATÓRIOS** e devem ser preenchidos:
- ✅ **titulo** - Título do empreendimento
- ✅ **tiposImoveis** - Tipo de imóvel (checkbox)
- ✅ **status** - Status do empreendimento
- ✅ **cidade** - Cidade
- ✅ **bairro** - Bairro
- ✅ **areaMin** - Área mínima
- ✅ **areaMax** - Área máxima
- ✅ **banheiros** - Pelo menos 1 opção
- ✅ **quartos** - Pelo menos 1 opção
- ✅ **vagas** - Pelo menos 1 opção
- ✅ **precoMin** - Preço mínimo
- ✅ **precoMax** - Preço máximo
- ✅ **imagens.banner** - Imagem de banner
- ✅ **imagens.map** - Imagem de mapa

## Campos Opcionais

Os seguintes campos podem ser deixados em branco:
- ⚪ **descricao** - Descrição (pode ser null)
- ⚪ **apartamentos** - Lista de apartamentos (sempre vazio, reservado para futuro)

## Comportamento de Validação

### 1. **Indicador Visual**
- Campo obrigatório marcado com **\***
- Campo com erro recebe classe CSS `.error` (borda vermelha)

### 2. **Mensagens de Erro**
- As mensagens aparecem **abaixo do campo** quando:
  - O campo foi tocado (clicado/focado) OU
  - O campo foi modificado (dirty)
  - E o campo está inválido (vazio ou com erro)

### 3. **Tipos de Mensagens**
```
Campo obrigatório         → "Campo obrigatório"
Campo com erro de min     → "Valor mínimo: X"
Campo com minlength       → "Mínimo de caracteres: X"
Selectbox em branco       → "Campo obrigatório"
Checkbox sem seleção      → "Campo obrigatório"
```

### 4. **Validação ao Salvar**
- Quando clica em "Criar" ou "Atualizar":
  1. Todos os campos são marcados como `touched` (para exibir erros)
  2. Validação é executada
  3. Se há erros, mensagem é exibida no console
  4. Se está tudo ok, o JSON é gerado e pode ser enviado ao servidor

## Como Usar No Componente Pai

### Criando o FormGroup

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class GerenciamentoEmpreendimentoComponent {
  
  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      tipoImovel: ['', Validators.required],
      status: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      areaMin: ['', [Validators.required, Validators.min(1)]],
      areaMax: ['', [Validators.required, Validators.min(1)]],
      banheiros: [[], Validators.required],
      quartos: [[], Validators.required],
      vagas: [[], Validators.required],
      precoMin: ['', [Validators.required, Validators.min(1)]],
      precoMax: ['', [Validators.required, Validators.min(1)]],
      descricao: [''], // Opcional
      diferenciais: [[]]
    });
  }
}
```

## Métodos Disponíveis

### `shouldShowError(fieldName: string): boolean`
- **Uso**: Determina se a mensagem de erro deve ser exibida
- **Retorna**: `true` se o campo está inválido e foi tocado/modificado
- **Exemplo**: `*ngIf="shouldShowError('titulo')"`

### `getErrorMessage(fieldName: string): string`
- **Uso**: Retorna a mensagem de erro apropriada
- **Retorna**: String com a mensagem de erro
- **Exemplo**: `{{ getErrorMessage('titulo') }}`

### `isFormValid(): boolean`
- **Uso**: Valida todo o formulário incluindo imagens
- **Retorna**: `true` se todos os campos obrigatórios são válidos

### `getImagensFormatadas()`
- **Uso**: Retorna as imagens em base64
- **Retorna**: Objeto com banner, map, plantas e galeria

### `onSalvar()`
- **Uso**: Processa o formulário e gera o JSON completo
- **Comportamento**: 
  - Marca todos os campos como touched
  - Valida o formulário
  - Se válido, gera o JSON e exibe no console
  - Se inválido, exibe erro no console

## Fluxo de Preenchimento

1. Usuário clica no campo → Campo recebe foco
2. Usuário digita/seleciona valor → Campo fica sujo (dirty)
3. Usuário sai do campo (blur) → Campo é marcado como touched
4. Se campo está vazio: ❌ Mensagem "Campo obrigatório" aparece
5. Usuário clica em "Criar/Atualizar":
   - Se houver erros → Todos erros são exibidos
   - Se tudo ok → JSON é gerado e pode ser enviado

## Exemplo de Resposta

Quando `onSalvar()` é chamado com sucesso, o console exibe:

```javascript
{
  "titulo": "Edifício Centro",
  "tiposImoveis": "Apartamento",
  "status": { "label": "Ativo", "value": "ativo" },
  "cidade": "São Paulo",
  "bairro": "Centro",
  "areaMin": 45,
  "areaMax": 120,
  "banheiros": ["1", "2", "3"],
  "quartos": ["Studio", "1", "2", "3"],
  "vagas": ["1", "2"],
  "precoMin": 350000,
  "precoMax": 900000,
  "descricao": "Edifício residencial no coração de São Paulo",
  "diferenciais": ["Piscina", "Academia"],
  "apartamentos": [],
  "imagens": {
    "banner": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "map": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "plantas": ["data:image/png;base64,..."],
    "galeria": ["data:image/png;base64,...", "data:image/png;base64,..."]
  }
}
```

## Testes Recomendados

- [ ] Tente deixar "Título" em branco e clicar em outro campo
- [ ] Selecione uma imagem para banner e veja ela aparecer
- [ ] Deixe todos os checkboxes em branco e clique em "Criar"
- [ ] Preencha todos os campos corretamente e clique em "Criar"
- [ ] Verifique o console para ver o JSON gerado
