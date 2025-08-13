from sqlalchemy import create_engine, text, inspect
import psycopg2
import sys

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'

def testar_conexao():
    try:
        print("Testando conexão com o banco de dados...")
        conn = psycopg2.connect(
            database="Sindplast",
            user="Sindplast",
            password="Sindplast",
            host="172.26.97.64",
            port="5432"
        )
        print("Conexão estabelecida com sucesso!")
        return conn
    except Exception as e:
        print(f"Erro ao conectar: {e}")
        return None

def verificar_estrutura_tabela(conn):
    try:
        print("\nVerificando estrutura da tabela Perfil...")
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_schema = '{SCHEMA}'
              AND table_name = 'Perfil'
            ORDER BY ordinal_position;
        """)
        columns = cursor.fetchall()
        
        print("\nColunas da tabela Perfil:")
        for col in columns:
            print(f"Nome: {col[0]}, Tipo: {col[1]}, Tamanho máximo: {col[2]}")
        
        return bool(columns)
    except Exception as e:
        print(f"Erro ao verificar estrutura: {e}")
        return False

def listar_dados_perfil(conn):
    try:
        print("\nListando dados da tabela Perfil...")
        cursor = conn.cursor()
        cursor.execute(f'SELECT * FROM "{SCHEMA}"."Perfil"')
        perfis = cursor.fetchall()
        
        if not perfis:
            print("Nenhum perfil encontrado na tabela.")
            return
        
        print("\nDados da tabela Perfil:")
        for perfil in perfis:
            print(f"IdPerfil: {perfil[0]}")
            print(f"Perfil: {perfil[1]}")
            print(f"Descricao: {perfil[2]}")
            for i in range(3, len(perfil)):
                print(f"Coluna {i+1}: {perfil[i]}")
            print("-" * 30)
    except Exception as e:
        print(f"Erro ao listar dados: {e}")

def main():
    try:
        conn = testar_conexao()
        if not conn:
            print("Não foi possível estabelecer conexão com o banco de dados.")
            return
        
        tabela_existe = verificar_estrutura_tabela(conn)
        if not tabela_existe:
            print("A tabela Perfil não foi encontrada ou não possui colunas.")
            return
        
        listar_dados_perfil(conn)
        
    except Exception as e:
        print(f"Erro durante diagnóstico: {e}")
    finally:
        if conn:
            conn.close()
            print("\nConexão fechada.")

if __name__ == "__main__":
    print("=== DIAGNÓSTICO DO BANCO DE DADOS ===")
    main()
    print("=== DIAGNÓSTICO CONCLUÍDO ===") 