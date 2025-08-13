from sqlalchemy import create_engine, text

DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'
TABLE = 'Empresas'

engine = create_engine(DB_URL)

def get_table_info():
    with engine.connect() as conn:
        try:
            # Obter colunas da tabela
            sql_columns = text(f"""
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = '{SCHEMA}' 
            AND table_name = '{TABLE}'
            ORDER BY ordinal_position
            """)
            
            print(f"Estrutura da tabela {SCHEMA}.{TABLE}:")
            result = conn.execute(sql_columns)
            columns = []
            for row in result:
                nullable = "NULL" if row[3] == "YES" else "NOT NULL"
                max_len = f"({row[2]})" if row[2] is not None else ""
                print(f"- {row[0]}: {row[1]}{max_len} {nullable}")
                columns.append(row[0])
            
            # Tenta obter uma amostra de dados
            if columns:
                try:
                    sql_sample = text(f'SELECT * FROM "{SCHEMA}"."{TABLE}" LIMIT 1')
                    print("\nAmostra de dados (1 registro):")
                    result = conn.execute(sql_sample)
                    row = result.fetchone()
                    if row:
                        for i, col in enumerate(columns):
                            value = row[i]
                            if value is None:
                                value = "NULL"
                            print(f"- {col}: {value}")
                    else:
                        print("Nenhum registro encontrado.")
                except Exception as e:
                    print(f"Erro ao obter amostra: {e}")
        except Exception as e:
            print(f"Erro ao consultar tabela: {e}")

if __name__ == "__main__":
    get_table_info() 