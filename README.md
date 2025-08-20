# SINDPLAST-AM

Sistema de gestão para o Sindicato dos Trabalhadores nas Indústrias de Material Plástico de Manaus e do Estado do Amazonas.

## Descrição

Aplicação web completa para gerenciamento de empresas, sócios, funcionários, usuários e permissões do sindicato.

## Tecnologias

### Frontend
- React com TypeScript
- Ant Design para componentes UI
- React Router para navegação
- Axios para requisições HTTP
- Framer Motion para animações

### Backend
- Flask (Python)
- PostgreSQL
- SQLAlchemy para ORM

## Estrutura do Projeto

```
├── Backend/          # Código backend em Python/Flask
├── public/           # Arquivos públicos
├── src/              # Código frontend React
│   ├── components/   # Componentes reutilizáveis
│   ├── contexts/     # Contextos React
│   ├── docs/         # Documentação técnica
│   ├── pages/        # Páginas da aplicação
│   ├── services/     # Serviços e APIs
│   ├── types/        # Definições de tipos TypeScript
│   └── utils/        # Funções utilitárias
├── package.json      # Dependências e scripts
└── tsconfig.json     # Configuração do TypeScript
```

## Instalação

1. Instalar dependências:
```bash
npm install
```

2. Iniciar o servidor de desenvolvimento:
```bash
npm start
```

## Documentação

A documentação técnica completa está disponível em `src/docs/`:

- [Guia de Estilo](src/docs/guiadeestilo.md)
- [Sistema de Temas](src/docs/temas.md)
- [Componentes de Loading](src/docs/loading.md)
- [Componentes de Modal](src/docs/modais.md)

## Melhorias Implementadas

### UI/UX
- Padronização de estilos dos modais
- Melhorias de acessibilidade (labels, ARIA attributes)
- Loading states mais detalhados
- Implementação de dark mode opcional

### Componentes
- `BaseModal`: Componente base reutilizável para todos os modais
- `CustomLoader`: Componente de loading personalizado
- `ThemeContext`: Sistema de gerenciamento de temas claro/escuro
- Padronização de todos os modais existentes

### Padrões
- Consistência visual em todos os componentes
- Acessibilidade aprimorada
- Performance otimizada
- Código mais manutenível

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm build`: Cria a build de produção
- `npm test`: Executa os testes
- `npm eject`: Eject do Create React App

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Projeto privado para SINDPLAST-AM.