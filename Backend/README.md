# Backend SINDPLAST-AM

Backend da aplicação SINDPLAST-AM desenvolvido com Flask.

## Configuração

1. Certifique-se de ter o Python instalado (versão 3.8+)
2. Crie um ambiente virtual Python:
   ```
   python -m venv venv
   ```
3. Ative o ambiente virtual:
   - Windows: `.\venv\Scripts\activate`
   - Linux/MacOS: `source venv/bin/activate`
4. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

## Executando o servidor

Para iniciar o servidor Flask, execute:

```
python app.py
```

O servidor estará disponível em http://localhost:5000.

## Endpoints da API

### Status da API
- GET `/api/status` - Retorna informações sobre a API

### Empresas
- GET `/api/empresas` - Lista todas as empresas
- GET `/api/empresas/<id>` - Retorna detalhes de uma empresa
- POST `/api/empresas` - Cria uma nova empresa
- PUT `/api/empresas/<id>` - Atualiza uma empresa
- DELETE `/api/empresas/<id>` - Remove uma empresa

## Modelo de Dados

O banco de dados inclui os seguintes modelos:

- Empresa
- Socio
- Funcionario
- Usuario

## Integração com Frontend

Este backend está configurado para trabalhar com o frontend React, usando CORS para permitir a comunicação entre os servidores. 