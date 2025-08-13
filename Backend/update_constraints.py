from sqlalchemy import create_engine, text

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'

engine = create_engine(DB_URL)

# Lista as constraints atuais
list_constraints = f"""
SELECT con.conname, con.contype, c.relname as table_name
FROM pg_constraint con
JOIN pg_class c ON con.conrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = '{SCHEMA}' AND c.relname = 'Perfil';
"""

# Remove a constraint antiga (Nome)
drop_constraint = f"""
ALTER TABLE "{SCHEMA}"."Perfil" DROP CONSTRAINT IF EXISTS "Perfil_Nome_key";
"""

# Adiciona a constraint para Perfil (se necessário)
add_constraint = f"""
ALTER TABLE "{SCHEMA}"."Perfil" 
ADD CONSTRAINT IF NOT EXISTS "Perfil_Perfil_key" UNIQUE ("Perfil");
"""

# Lista todas as colunas da tabela Perfil
list_columns = f"""
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = '{SCHEMA}' AND table_name = 'Perfil'
ORDER BY ordinal_position;
"""

with engine.begin() as conn:
    print("Listando colunas da tabela Perfil:")
    try:
        result = conn.execute(text(list_columns))
        for row in result:
            print(f"Coluna: {row[0]}, Tipo: {row[1]}, Tamanho: {row[2]}")
    except Exception as e:
        print(f"Erro ao listar colunas: {str(e)}")

    print("\nListando constraints atuais:")
    try:
        result = conn.execute(text(list_constraints))
        found = False
        for row in result:
            found = True
            print(f"Constraint: {row[0]}, Tipo: {row[1]}, Tabela: {row[2]}")
        if not found:
            print("Nenhuma constraint encontrada para a tabela Perfil")
    except Exception as e:
        print(f"Erro ao listar constraints: {str(e)}")
    
    print("\nRemovendo constraint antiga:")
    try:
        conn.execute(text(drop_constraint))
        print("Constraint Perfil_Nome_key removida (se existia)")
    except Exception as e:
        print(f"Erro ao remover constraint: {str(e)}")
    
    print("\nAdicionando nova constraint:")
    try:
        conn.execute(text(add_constraint))
        print("Constraint Perfil_Perfil_key adicionada (se não existia)")
    except Exception as e:
        print(f"Erro ao adicionar constraint: {str(e)}")

print("Operação concluída!") 