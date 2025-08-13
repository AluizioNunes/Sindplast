from sqlalchemy import create_engine, text

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'

engine = create_engine(DB_URL)

# Alterar a tabela para adicionar colunas que podem estar faltando
alter_table = f'''
ALTER TABLE "{SCHEMA}"."Perfil" 
ADD COLUMN IF NOT EXISTS "Cadastrante" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "DataCadastro" TIMESTAMP;
'''

with engine.connect() as conn:
    conn.execute(text(alter_table))
    print("Colunas adicionadas à tabela Perfil (se ainda não existiam).")

print("Alteração concluída com sucesso!") 