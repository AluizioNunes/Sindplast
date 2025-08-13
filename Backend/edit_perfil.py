from sqlalchemy import create_engine, text
import datetime

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'

engine = create_engine(DB_URL)

# Inserir um perfil diretamente no banco
insert_perfil = f"""
INSERT INTO "{SCHEMA}"."Perfil" ("Perfil", "Descricao", "Cadastrante", "DataCadastro")
VALUES ('PERFIL DE TESTE NOVO', 'Criado para teste direto no banco', 'SISTEMA', '{datetime.datetime.now()}')
RETURNING "IdPerfil";
"""

with engine.begin() as conn:  # begin() inicia uma transação e faz commit automaticamente
    try:
        result = conn.execute(text(insert_perfil))
        id_perfil = result.fetchone()[0]
        print(f"Perfil inserido com sucesso! ID: {id_perfil}")
    except Exception as e:
        print(f"Erro ao inserir perfil: {str(e)}")
        # Rollback é automático se ocorrer uma exceção

# Verificar se o perfil foi inserido
verificar_perfil = f"""
SELECT * FROM "{SCHEMA}"."Perfil" 
WHERE "Perfil" = 'PERFIL DE TESTE NOVO';
"""

with engine.connect() as conn:
    try:
        result = conn.execute(text(verificar_perfil))
        perfil = result.fetchone()
        if perfil:
            print(f"Verificação: Perfil encontrado no banco! ID: {perfil[0]}")
        else:
            print("Verificação: Perfil NÃO encontrado no banco!")
    except Exception as e:
        print(f"Erro ao verificar perfil: {str(e)}")

print("Operação concluída!") 