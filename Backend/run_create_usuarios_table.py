from sqlalchemy import create_engine, text

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'

sql = '''
CREATE TABLE "Sindplast".usuarios (
    "IdUsuarios" SERIAL PRIMARY KEY,
    "Nome" VARCHAR(300) NOT NULL,
    "CPF" VARCHAR(14) UNIQUE,
    "Email" VARCHAR(400) UNIQUE,
    "Usuario" VARCHAR(400) UNIQUE,
    "Senha" VARCHAR(400) NOT NULL,
    "Cadastrante" VARCHAR(400),
    "DataCadastro" TIMESTAMP
);
'''

engine = create_engine(DB_URL)
with engine.connect() as conn:
    try:
        conn.execute(text(sql))
        print('Tabela usuarios criada com sucesso!')
    except Exception as e:
        print('Erro ao criar tabela:', e) 