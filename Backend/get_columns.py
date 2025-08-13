from app import app, db
from sqlalchemy import text

def get_table_info(schema_name, table_name):
    with app.app_context():
        try:
            # Obter colunas da tabela
            sql_columns = text(f"""
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = '{schema_name}' 
            AND table_name = '{table_name}'
            ORDER BY ordinal_position
            """)
            
            # Exibe informações das colunas
            print(f"Estrutura da tabela {schema_name}.{table_name}:")
            result = db.session.execute(sql_columns)
            columns = []
            for row in result:
                nullable = "NULL" if row[3] == "YES" else "NOT NULL"
                max_len = f"({row[2]})" if row[2] is not None else ""
                print(f"- {row[0]}: {row[1]}{max_len} {nullable}")
                columns.append(row[0])
            
            # Tenta obter uma amostra de dados
            if columns:
                try:
                    sql_sample = text(f'SELECT * FROM "{schema_name}"."{table_name}" LIMIT 1')
                    print("\nAmostra de dados (1 registro):")
                    result = db.session.execute(sql_sample)
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
    get_table_info('Sindplast', 'Socios') 