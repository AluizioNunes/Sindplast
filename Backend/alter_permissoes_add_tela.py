from sqlalchemy import create_engine, text

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
engine = create_engine(DB_URL)

sql = '''
ALTER TABLE "Sindplast"."Permissoes"
ADD COLUMN IF NOT EXISTS "Tela" VARCHAR(100);
'''

with engine.connect() as conn:
    try:
        conn.execute(text(sql))
        print('Campo Tela adicionado na tabela Permissoes.')
    except Exception as e:
        print('Erro ao alterar tabela Permissoes:', e) 