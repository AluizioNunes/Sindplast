from sqlalchemy import create_engine, text

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'

engine = create_engine(DB_URL)

# 1. Verificar se a coluna Perfil existe, se não, criá-la
check_perfil_column = f"""
SELECT column_name
FROM information_schema.columns
WHERE table_schema = '{SCHEMA}'
  AND table_name = 'Perfil'
  AND column_name = 'Perfil';
"""

# 2. Verificar se a coluna Nome existe
check_nome_column = f"""
SELECT column_name
FROM information_schema.columns
WHERE table_schema = '{SCHEMA}'
  AND table_name = 'Perfil'
  AND column_name = 'Nome';
"""

# 3. Migrar dados de Nome para Perfil (se necessário)
migrate_data = f"""
UPDATE "{SCHEMA}"."Perfil"
SET "Perfil" = "Nome"
WHERE "Perfil" IS NULL;
"""

# 4. Remover coluna Nome se existir e se a migração estiver concluída
drop_nome_column = f"""
ALTER TABLE "{SCHEMA}"."Perfil" DROP COLUMN IF EXISTS "Nome";
"""

with engine.connect() as conn:
    # Verificar se a coluna Perfil existe
    result_perfil = conn.execute(text(check_perfil_column))
    perfil_exists = result_perfil.fetchone() is not None
    
    # Verificar se a coluna Nome existe
    result_nome = conn.execute(text(check_nome_column))
    nome_exists = result_nome.fetchone() is not None
    
    if not perfil_exists:
        # Adicionar coluna Perfil se não existir
        conn.execute(text(f'ALTER TABLE "{SCHEMA}"."Perfil" ADD COLUMN "Perfil" VARCHAR(50) UNIQUE;'))
        print("Coluna Perfil criada.")
    
    if nome_exists and perfil_exists:
        # Migrar dados
        conn.execute(text(migrate_data))
        print("Dados migrados de Nome para Perfil.")
        
        # Remover coluna Nome
        conn.execute(text(drop_nome_column))
        print("Coluna Nome removida.")
    
    print("Migração concluída com sucesso!") 