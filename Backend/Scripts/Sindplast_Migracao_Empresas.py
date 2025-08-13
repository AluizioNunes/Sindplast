#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Migração de Empresas - SINDPLAST
Migra dados do arquivo JSON para a tabela Empresas do banco de dados
"""

import json
import re
from datetime import datetime
from sqlalchemy import create_engine, text
from decimal import Decimal, InvalidOperation

# Configuração do banco de dados
DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'
TABLE = 'Empresas'

# Caminho do arquivo JSON
JSON_FILE = '../Data/Empresas.json'

def formatar_cnpj(cnpj):
    """Formata CNPJ para XX.XXX.XXX/XXXX-XX"""
    if not cnpj:
        return None
    
    # Remove caracteres não numéricos
    cnpj_limpo = re.sub(r'[^\d]', '', str(cnpj))
    
    # Verifica se tem 14 dígitos
    if len(cnpj_limpo) != 14:
        return cnpj  # Retorna original se não tiver 14 dígitos
    
    # Aplica a máscara XX.XXX.XXX/XXXX-XX
    return f"{cnpj_limpo[:2]}.{cnpj_limpo[2:5]}.{cnpj_limpo[5:8]}/{cnpj_limpo[8:12]}-{cnpj_limpo[12:]}"

def formatar_telefone(telefone):
    """Formata telefone para (XX) XXXX-XXXX"""
    if not telefone:
        return None
    
    # Remove caracteres não numéricos
    telefone_limpo = re.sub(r'[^\d]', '', str(telefone))
    
    # Verifica se tem 10 ou 11 dígitos
    if len(telefone_limpo) == 10:
        return f"({telefone_limpo[:2]}) {telefone_limpo[2:6]}-{telefone_limpo[6:]}"
    elif len(telefone_limpo) == 11:
        return f"({telefone_limpo[:2]}) {telefone_limpo[2:7]}-{telefone_limpo[7:]}"
    else:
        return telefone  # Retorna original se não tiver formato válido

def formatar_celular(celular):
    """Formata celular para (XX) XXXXX-XXXX"""
    if not celular:
        return None
    
    # Remove caracteres não numéricos
    celular_limpo = re.sub(r'[^\d]', '', str(celular))
    
    # Verifica se tem 11 dígitos
    if len(celular_limpo) == 11:
        return f"({celular_limpo[:2]}) {celular_limpo[2:7]}-{celular_limpo[7:]}"
    else:
        return celular  # Retorna original se não tiver formato válido

def formatar_cep(cep):
    """Formata CEP para XXXXX-XXX"""
    if not cep:
        return None
    
    # Remove caracteres não numéricos
    cep_limpo = re.sub(r'[^\d]', '', str(cep))
    
    # Verifica se tem 8 dígitos
    if len(cep_limpo) == 8:
        return f"{cep_limpo[:5]}-{cep_limpo[5:]}"
    else:
        return cep  # Retorna original se não tiver formato válido

def extrair_cidade_uf(cidade_uf):
    """Extrai cidade e UF do campo ECID"""
    if not cidade_uf:
        return None, None
    
    # Remove espaços extras
    cidade_uf = cidade_uf.strip()
    
    # Procura por padrões como "MANAUS/AM" ou "MANAUS"
    if '/' in cidade_uf:
        partes = cidade_uf.split('/')
        cidade = partes[0].strip()
        uf = partes[1].strip() if len(partes) > 1 else None
    else:
        cidade = cidade_uf
        uf = None
    
    return cidade, uf

def converter_data(data_string):
    """Converte string de data para objeto datetime"""
    if not data_string:
        return None
    
    try:
        # Remove a parte de timezone se existir
        if 'T' in data_string:
            data_string = data_string.split('T')[0]
        
        # Converte para datetime
        return datetime.strptime(data_string, '%Y-%m-%d')
    except:
        return None

def migrar_empresas():
    """Função principal de migração"""
    
    # Conectar ao banco de dados
    engine = create_engine(DB_URL)
    
    try:
        # Carregar dados do JSON
        print("Carregando dados do arquivo JSON...")
        with open(JSON_FILE, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        empresas_json = data.get('Empresa', [])
        print(f"Encontradas {len(empresas_json)} empresas no JSON")
        
        # Contadores
        total_migradas = 0
        total_erros = 0
        
        with engine.connect() as conn:
            # Iniciar transação
            trans = conn.begin()
            
            try:
                for i, empresa_json in enumerate(empresas_json, 1):
                    print(f"Processando empresa {i}/{len(empresas_json)}: {empresa_json.get('ENOME', 'N/A')}")
                    
                    # Extrair cidade e UF
                    cidade, uf = extrair_cidade_uf(empresa_json.get('ECID'))
                    
                    # Preparar dados para inserção
                    valor = empresa_json.get('EVALOR')
                    try:
                        valor_contribuicao = Decimal(str(valor)) if valor is not None else None
                    except (InvalidOperation, TypeError):
                        valor_contribuicao = None

                    dados_empresa = {
                        'CodEmpresa': str(empresa_json.get('ECODIG', '')),
                        'CNPJ': formatar_cnpj(empresa_json.get('ECGC')),
                        'RazaoSocial': empresa_json.get('ENOME'),
                        'NomeFantasia': empresa_json.get('ENOME'),  # Mesmo valor da razão social
                        'Endereco': empresa_json.get('EEND'),
                        'Numero': None,  # Não disponível no JSON
                        'Complemento': None,  # Não disponível no JSON
                        'Bairro': empresa_json.get('EBAIRRO'),
                        'CEP': formatar_cep(empresa_json.get('ECEP')),
                        'Cidade': cidade,
                        'UF': uf,
                        'Telefone01': formatar_telefone(empresa_json.get('EFONE1')),
                        'Telefone02': formatar_telefone(empresa_json.get('EFONE2')),
                        'Fax': formatar_telefone(empresa_json.get('EFAX')),
                        'Celular': None,  # Não disponível no JSON
                        'WhatsApp': None,  # Não disponível no JSON
                        'Instagram': None,  # Não disponível no JSON
                        'Linkedin': None,  # Não disponível no JSON
                        'NFuncionarios': empresa_json.get('ENFUNC'),
                        'DataContribuicao': converter_data(empresa_json.get('EDTCON')),
                        'ValorContribuicao': valor_contribuicao,
                        'DataCadastro': datetime.now(),
                        'Cadastrante': 'Sistema de Migração',
                        'Observacao': empresa_json.get('EOBS')
                    }
                    
                    # Verificar se empresa já existe (por CNPJ)
                    if dados_empresa['CNPJ']:
                        sql_check = text(f"""
                            SELECT "IdEmpresa" FROM "{SCHEMA}"."{TABLE}" 
                            WHERE "CNPJ" = :cnpj
                        """)
                        result = conn.execute(sql_check, {'cnpj': dados_empresa['CNPJ']})
                        if result.fetchone():
                            print(f"  ⚠️  Empresa com CNPJ {dados_empresa['CNPJ']} já existe. Pulando...")
                            continue
                    
                    # Inserir empresa
                    sql_insert = text(f"""
                        INSERT INTO "{SCHEMA}"."{TABLE}" (
                            "CodEmpresa", "CNPJ", "RazaoSocial", "NomeFantasia", "Endereco", 
                            "Numero", "Complemento", "Bairro", "CEP", "Cidade", "UF",
                            "Telefone01", "Telefone02", "Fax", "Celular", "WhatsApp",
                            "Instagram", "Linkedin", "NFuncionarios", "DataContribuicao",
                            "ValorContribuicao", "DataCadastro", "Cadastrante", "Observacao"
                        ) VALUES (
                            :CodEmpresa, :CNPJ, :RazaoSocial, :NomeFantasia, :Endereco,
                            :Numero, :Complemento, :Bairro, :CEP, :Cidade, :UF,
                            :Telefone01, :Telefone02, :Fax, :Celular, :WhatsApp,
                            :Instagram, :Linkedin, :NFuncionarios, :DataContribuicao,
                            :ValorContribuicao, :DataCadastro, :Cadastrante, :Observacao
                        )
                    """)
                    
                    conn.execute(sql_insert, dados_empresa)
                    total_migradas += 1
                    print(f"  ✅ Migrada com sucesso")
                
                # Commit da transação
                trans.commit()
                print(f"\n🎉 Migração concluída!")
                print(f"✅ Total de empresas migradas: {total_migradas}")
                print(f"❌ Total de erros: {total_erros}")
                
            except Exception as e:
                # Rollback em caso de erro
                trans.rollback()
                print(f"❌ Erro durante a migração: {e}")
                raise
    
    except FileNotFoundError:
        print(f"❌ Arquivo JSON não encontrado: {JSON_FILE}")
    except json.JSONDecodeError as e:
        print(f"❌ Erro ao decodificar JSON: {e}")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando migração de empresas do SINDPLAST")
    print("=" * 50)
    migrar_empresas()
    print("=" * 50)
    print("🏁 Processo finalizado") 