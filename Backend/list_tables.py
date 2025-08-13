from sqlalchemy import create_engine, inspect

# Configuração igual ao app.py
DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'

engine = create_engine(DB_URL)
inspector = inspect(engine)

tables = inspector.get_table_names(schema=SCHEMA)

print(f'Tabelas no schema {SCHEMA}:')
for table in tables:
    print(f'- {table}') 