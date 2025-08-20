# Componentes de Modal

## Visão Geral

Os modais seguem um padrão consistente em toda a aplicação para garantir uma experiência de usuário uniforme.

## BaseModal

Componente base reutilizável que implementa o padrão de modal da aplicação.

### Props

| Prop         | Tipo      | Padrão       | Descrição                              |
|--------------|-----------|--------------|----------------------------------------|
| visible      | boolean   | -            | Controla a visibilidade do modal       |
| onCancel     | function  | -            | Função chamada ao fechar o modal       |
| title        | string    | -            | Título exibido no modal                |
| children     | ReactNode | -            | Conteúdo do modal                      |
| onSubmit     | function  | undefined    | Função chamada ao clicar em salvar     |
| loading      | boolean   | false        | Estado de carregamento                 |
| isEdit       | boolean   | false        | Indica se é edição ou criação          |
| submitButtonText | string | "SALVAR"    | Texto do botão de submit               |
| showFooter   | boolean   | true         | Exibe ou oculta o rodapé               |
| width        | number    | 900          | Largura do modal em pixels             |
| showHeader   | boolean   | true         | Exibe ou oculta o cabeçalho            |
| homeRedirect | boolean   | true         | Redireciona para home ao clicar no header |

### Uso

```tsx
import BaseModal from '../components/BaseModal';

<BaseModal
  visible={modalVisible}
  onCancel={handleCancel}
  title={isEdit ? "Editar Item" : "Novo Item"}
  onSubmit={handleSubmit}
  loading={loading}
  isEdit={!!editingItem}
>
  {/* Conteúdo do formulário */}
  <Form form={form} layout="vertical">
    <Form.Item name="nome" label="Nome">
      <Input />
    </Form.Item>
  </Form>
</BaseModal>
```

## Componentes Específicos

### EmpresaModal

Modal para cadastro/edição de empresas com navegação por etapas (Steps).

### SocioModal

Modal para cadastro/edição de sócios com navegação por etapas (Steps).

### UsuarioModal

Modal para cadastro/edição de usuários.

### PerfilModal

Modal para cadastro/edição de perfis.

### PermissoesModal

Modal para cadastro/edição de permissões.

### ConfirmModal

Modal para confirmação de ações (exclusão, etc).

## Padrão Visual

### Cabeçalho
- Cor de fundo: `#F2311F` (vermelho)
- Texto: branco
- Altura: 60px
- Logo e descrição do sindicato

### Conteúdo
- Padding: `20px 30px`
- Cor de fundo: `#f5f7e9` (bege claro)

### Botões
- **Salvar**: Verde (`#4caf50`)
- **Cancelar**: Vermelho (`#f44336`)
- Altura: 45px
- Largura: 180px
- Border radius: 4px
- Font weight: bold

### Navegação por Etapas (Steps)
- Utilizado em EmpresaModal e SocioModal
- Indicadores visuais de progresso
- Botões "Anterior" e "Próximo"

## Acessibilidade

### Labels e ARIA
- Todos os botões possuem `aria-label` descritivo
- Inputs com labels associadas
- Títulos com hierarquia semântica

### Navegação
- Fechamento com ESC
- Foco gerenciado corretamente
- Tabulação entre elementos
- Suporte a leitores de tela

### Contraste
- Cores com contraste adequado
- Adaptável ao modo dark/light
- Texto legível em todos os contextos

## Personalização

### Criar novo modal
1. Importe BaseModal:
```tsx
import BaseModal from '../components/BaseModal';
```

2. Utilize com props apropriadas:
```tsx
<BaseModal
  visible={visible}
  onCancel={onCancel}
  title="Meu Modal"
  onSubmit={onSubmit}
  loading={loading}
>
  {/* Conteúdo específico */}
</BaseModal>
```

### Estilos customizados
Para estilos específicos, passe via prop `style`:
```tsx
<BaseModal
  visible={visible}
  style={{ maxWidth: '600px' }}
  // ... outras props
>
  {/* Conteúdo */}
</BaseModal>
```

## Boas Práticas

1. **Consistência**: Sempre utilizar o BaseModal como base
2. **Acessibilidade**: Incluir aria-labels e labels descritivas
3. **Responsividade**: Testar em diferentes tamanhos de tela
4. **Performance**: Utilizar `destroyOnClose` para modais pesados
5. **Feedback**: Mostrar estados de loading durante operações
6. **Validação**: Implementar validação de formulários
7. **Erros**: Tratar e mostrar mensagens de erro apropriadas