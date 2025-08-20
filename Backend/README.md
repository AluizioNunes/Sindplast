# Instruções de Instalação - Backend

## Dependências Necessárias

Certifique-se de ter o Python 3.8+ instalado no sistema.

### Instalar dependências do Flask

```bash
# Navegar até o diretório Backend
cd Backend

# Criar ambiente virtual (opcional mas recomendado)
python -m venv venv

# Ativar ambiente virtual (Windows)
venv\\Scripts\\activate

# Ativar ambiente virtual (Linux/Mac)
source venv/bin/activate

# Instalar dependências
pip install flask
pip install flask-cors
pip install flask-sqlalchemy
pip install flask-jwt-extended
pip install psycopg2-binary
pip install python-dotenv

# Ou instalar todas de uma vez
pip install flask flask-cors flask-sqlalchemy flask-jwt-extended psycopg2-binary python-dotenv
```

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório Backend com as seguintes variáveis:

```env
# Configurações do Banco de Dados
DATABASE_URL=postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast

# Configurações JWT
JWT_SECRET_KEY=sindplast-jwt-secret-key-change-in-production

# Outras configurações
FLASK_ENV=development
FLASK_DEBUG=True
```

### Executar o Servidor

```bash
# Com ambiente virtual ativado
python app.py

# Ou
flask run

# O servidor estará disponível em http://localhost:5000
```

## Estrutura do Backend

```
Backend/
├── app.py              # Aplicação principal
├── auth_routes.py      # Rotas de autenticação
├── models.py           # Modelos do banco de dados
├── .env               # Variáveis de ambiente
└── requirements.txt    # Dependências (será criado)
```

## Criar requirements.txt

```bash
# Gerar arquivo de dependências
pip freeze > requirements.txt
```

Conteúdo esperado do requirements.txt:
```
Flask==2.3.3
Flask-Cors==4.0.0
Flask-JWT-Extended==4.5.3
Flask-SQLAlchemy==3.0.5
psycopg2-binary==2.9.7
python-dotenv==1.0.0
```

## Configuração do Banco de Dados

O sistema utiliza PostgreSQL. Certifique-se de que:

1. O servidor PostgreSQL está rodando
2. O banco de dados "Sindplast" existe
3. O usuário "Sindplast" com senha "Sindplast" tem acesso
4. As tabelas foram criadas (scripts disponíveis)

## Desenvolvimento

### Debugging

```bash
# Executar com modo debug
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Testes de API

Use ferramentas como Postman ou curl para testar os endpoints:

```bash
# Testar endpoint público
curl http://localhost:5000/api/status

# Testar login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"usuario":"Admin","senha":"Sindplast"}'
```

## Produção

### Configurações de Produção

1. Alterar `JWT_SECRET_KEY` para um valor seguro
2. Configurar HTTPS
3. Usar servidor WSGI como Gunicorn
4. Configurar variáveis de ambiente apropriadas

### Deploy com Gunicorn

```bash
# Instalar Gunicorn
pip install gunicorn

# Executar com Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker (Opcional)

Crie um Dockerfile para containerização:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```