from sqlalchemy import create_engine, text

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'

engine = create_engine(DB_URL)

sql = f'''
CREATE TABLE IF NOT EXISTS "{SCHEMA}"."Perfil" (
    "IdPerfil" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Perfil" VARCHAR(50) UNIQUE NOT NULL,
    "Descricao" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "{SCHEMA}"."Permissoes" (
    "IdPermissao" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Nome" VARCHAR(50) UNIQUE NOT NULL,
    "Descricao" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "{SCHEMA}"."PerfilPermissao" (
    "IdPerfil" INTEGER REFERENCES "{SCHEMA}"."Perfil"("IdPerfil") ON DELETE CASCADE,
    "IdPermissao" INTEGER REFERENCES "{SCHEMA}"."Permissoes"("IdPermissao") ON DELETE CASCADE,
    PRIMARY KEY ("IdPerfil", "IdPermissao")
);
'''

with engine.connect() as conn:
    for statement in sql.strip().split(';'):
        stmt = statement.strip()
        if stmt:
            conn.execute(text(stmt))
    print('Tabelas Perfil, Permissoes e PerfilPermissao criadas (se não existiam).') 