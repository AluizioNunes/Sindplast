# Sistema de Autenticação

## Visão Geral

O sistema de autenticação utiliza JWT (JSON Web Tokens) para gerenciar sessões de usuários de forma segura e stateless.

## Arquitetura

### Backend (Flask)
- **Flask-JWT-Extended**: Biblioteca para implementação de JWT
- **Tokens de acesso**: Curta duração (8 horas)
- **Tokens de refresh**: Longa duração (30 dias)
- **Endpoints de autenticação**: `/api/auth/*`

### Frontend (React)
- **AuthContext**: Gerenciamento de estado de autenticação
- **Axios interceptors**: Adição automática de tokens
- **Renovação automática**: Refresh de tokens expirados

## Endpoints da API

### POST `/api/auth/login`
Autentica um usuário e retorna tokens de acesso.

**Request:**
```json
{
  "usuario": "nome_do_usuario",
  "senha": "senha_do_usuario"
}
```

**Response (sucesso):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Nome do Usuário",
    "usuario": "nome_do_usuario",
    "perfil": "ADMINISTRADOR",
    "funcao": "Gerente",
    "email": "usuario@exemplo.com"
  }
}
```

### POST `/api/auth/refresh`
Renova o token de acesso usando o token de refresh.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/api/auth/logout`
Invalida a sessão do usuário.

**Response:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

### GET `/api/auth/me`
Retorna informações do usuário autenticado.

**Response:**
```json
{
  "success": true,
  "usuario": {
    "id": 1,
    "nome": "Nome do Usuário",
    "usuario": "nome_do_usuario",
    "perfil": "ADMINISTRADOR",
    "funcao": "Gerente",
    "email": "usuario@exemplo.com"
  }
}
```

## Implementação no Frontend

### AuthContext

O contexto de autenticação gerencia o estado global da autenticação:

```tsx
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Provider na raiz da aplicação
<AuthProvider>
  <App />
</AuthProvider>

// Hook para usar em componentes
const { user, token, login, logout, isAuthenticated, loading, error } = useAuth();
```

### Fluxo de Autenticação

1. **Login:**
   - Usuário informa credenciais
   - Requisição para `/api/auth/login`
   - Tokens salvos no localStorage
   - Axios configurado com token de acesso

2. **Requisições Autenticadas:**
   - Token adicionado automaticamente aos headers
   - Interceptador trata erros 401
   - Refresh automático se necessário

3. **Logout:**
   - Requisição para `/api/auth/logout`
   - Limpeza de tokens do localStorage
   - Redirecionamento para login

## Segurança

### Tokens JWT
- **Assinatura**: Protege contra alterações
- **Expiração**: Limita tempo de uso
- **Claims**: Informações adicionais do usuário

### Melhores Práticas
- **HTTPS**: Sempre usar em produção
- **Armazenamento**: localStorage com cuidado
- **Refresh tokens**: Renovação automática
- **Invalidação**: Tratamento de tokens expirados

## Integração com Componentes

### Header
- Exibe informações do usuário logado
- Menu dropdown com opções de perfil/logout

### Sidebar
- Integração com função de logout
- Navegação protegida por autenticação

### ApiService
- Adição automática de tokens
- Tratamento de erros de autenticação
- Renovação de tokens

## Personalização

### Perfis e Permissões
O sistema pode ser estendido para:
- Controle de acesso baseado em perfis
- Permissões granulares por funcionalidade
- Menu dinâmico baseado em permissões

### Refresh Tokens
- Implementação de blacklist para invalidação
- Armazenamento seguro em HTTP-only cookies
- Tempo de expiração configurável

## Troubleshooting

### Problemas Comuns

1. **Token expirado:**
   - Sistema tenta refresh automático
   - Se falhar, redireciona para login

2. **401 Unauthorized:**
   - Verificar token no localStorage
   - Confirmar usuário/senha no login

3. **403 Forbidden:**
   - Verificar permissões do usuário
   - Confirmar perfil atribuído

### Debugging

```javascript
// Verificar token no console
console.log('Token:', localStorage.getItem('token'));

// Verificar usuário
console.log('User:', localStorage.getItem('user'));

// Forçar refresh
localStorage.removeItem('token');
window.location.reload();
```