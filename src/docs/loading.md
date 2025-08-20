# Componentes de Loading

## CustomLoader

Componente de loading personalizado usado para indicar estados de carregamento na aplicação.

### Props

| Prop      | Tipo              | Padrão       | Descrição                           |
|-----------|-------------------|--------------|-------------------------------------|
| message   | string            | "Carregando..." | Mensagem exibida abaixo do spinner |
| size      | "small" \| "default" \| "large" | "large"      | Tamanho do spinner                 |
| style     | React.CSSProperties | undefined    | Estilos customizados adicionais    |

### Uso

```tsx
import CustomLoader from '../components/CustomLoader';

// Uso básico
<CustomLoader />

// Com mensagem personalizada
<CustomLoader message="Carregando dados..." />

// Com tamanho pequeno
<CustomLoader size="small" />

// Com estilos customizados
<CustomLoader 
  message="Processando..." 
  style={{ marginTop: '20px' }} 
/>
```

### Exemplos de uso em diferentes contextos

#### 1. Em tabelas
```tsx
const tableLoading = {
  spinning: loading,
  indicator: <CustomLoader message="Carregando registros..." size="default" />
};

<Table loading={tableLoading} />
```

#### 2. Em listas
```tsx
<List
  loading={{
    spinning: loading,
    indicator: <CustomLoader message="Carregando itens..." size="default" />
  }}
/>
```

#### 3. Em cards
```tsx
{loading ? (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
    <CustomLoader message="Carregando conteúdo..." />
  </div>
) : (
  // Conteúdo quando carregado
)}
```

## Estilos

O componente utiliza:
- Spinner da biblioteca Ant Design
- Cores personalizadas (`#F2311F` para o spinner)
- Layout centralizado
- Texto com cor secundária (`#666` no light mode, `#ccc` no dark mode)

## Acessibilidade

- O spinner possui a propriedade `aria-label` com o valor "Carregando"
- A mensagem é lida por leitores de tela
- O componente é totalmente navegável por teclado