#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Migração de Sócios - SINDPLAST
Migra dados do arquivo JSON para a tabela Socios do banco de dados
Relaciona campos da empresa pelo CodEmpresa
"""

import json
import re
from datetime import datetime
from sqlalchemy import create_engine, text
from decimal import Decimal, InvalidOperation
import os

# Configuração do banco de dados
DB_URL = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
SCHEMA = 'Sindplast'
TABLE = 'Socios'

# Caminhos dos arquivos JSON
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOCIOS_JSON = os.path.join(BASE_DIR, 'Data', 'Socios.json')
EMPRESAS_JSON = os.path.join(BASE_DIR, 'Data', 'Empresas.json')

# Funções utilitárias de formatação (reaproveitadas do script de empresas)
def formatar_cnpj(cnpj):
    if not cnpj:
        return None
    cnpj_limpo = re.sub(r'[^\d]', '', str(cnpj))
    if len(cnpj_limpo) != 14:
        return cnpj
    return f"{cnpj_limpo[:2]}.{cnpj_limpo[2:5]}.{cnpj_limpo[5:8]}/{cnpj_limpo[8:12]}-{cnpj_limpo[12:]}"

def formatar_telefone(telefone):
    if not telefone:
        return None
    telefone_limpo = re.sub(r'[^\d]', '', str(telefone))
    if len(telefone_limpo) == 10:
        return f"({telefone_limpo[:2]}) {telefone_limpo[2:6]}-{telefone_limpo[6:]}"
    elif len(telefone_limpo) == 11:
        return f"({telefone_limpo[:2]}) {telefone_limpo[2:7]}-{telefone_limpo[7:]}"
    else:
        return telefone

def formatar_celular(celular):
    if not celular:
        return None
    celular_limpo = re.sub(r'[^\d]', '', str(celular))
    if len(celular_limpo) == 11:
        return f"({celular_limpo[:2]}) {celular_limpo[2:7]}-{celular_limpo[7:]}"
    else:
        return celular

def formatar_cep(cep):
    if not cep:
        return None
    cep_limpo = re.sub(r'[^\d]', '', str(cep))
    if len(cep_limpo) == 8:
        return f"{cep_limpo[:5]}-{cep_limpo[5:]}"
    else:
        return cep

def converter_data(data_string):
    if not data_string:
        return None
    try:
        if 'T' in data_string:
            data_string = data_string.split('T')[0]
        return datetime.strptime(data_string, '%Y-%m-%d')
    except:
        return None

def carregar_empresas():
    """Carrega empresas do JSON em um dicionário indexado por CodEmpresa"""
    with open(EMPRESAS_JSON, 'r', encoding='utf-8') as file:
        data = json.load(file)
    empresas = {}
    for empresa in data.get('Empresa', []):
        cod = str(empresa.get('ECODIG', ''))
        empresas[cod] = empresa
    return empresas

def migrar_socios():
    print('Carregando empresas...')
    empresas = carregar_empresas()
    print(f"Total de empresas carregadas: {len(empresas)}")

    print('Carregando sócios do JSON...')
    with open(SOCIOS_JSON, 'r', encoding='utf-8') as file:
        data = json.load(file)
    socios_json = data.get('Socio', [])
    print(f"Total de sócios encontrados: {len(socios_json)}")

    engine = create_engine(DB_URL)
    total_migrados = 0
    total_erros = 0

    # Processar cada sócio com conexão individual
    for i, socio_json in enumerate(socios_json, 1):
        print(f"Processando sócio {i}/{len(socios_json)}: {socio_json.get('SNOME', 'N/A')}")
        
        # Criar nova conexão para cada sócio
        with engine.connect() as conn:
            try:
                cod_empresa = str(socio_json.get('ECODIG', ''))
                empresa = empresas.get(cod_empresa, {})
                # Preencher campos da empresa
                cnpj_empresa = formatar_cnpj(empresa.get('ECGC')) if empresa else None
                razao_empresa = empresa.get('ENOME') if empresa else None
                nome_fantasia = empresa.get('ENOME') if empresa else None

                # Preencher campos do sócio (ajustar conforme estrutura real da tabela Socios)
                dados_socio = {
                    'Nome': socio_json.get('SNOME'),
                    'RG': socio_json.get('SIDENT'),
                    'Emissor': None,  # Não disponível no JSON
                    'CPF': None,  # Não disponível no JSON
                    'Nascimento': converter_data(socio_json.get('SDNASC')),
                    'Naturalidade': socio_json.get('SNATURAL'),
                    'NaturalidadeUF': None,  # Sempre NULL conforme orientação
                    'Nacionalidade': 'BRASILEIRO',
                    'Sexo': socio_json.get('SSEXO'),
                    'EstadoCivil': socio_json.get('SESTCIVIL'),
                    'Endereco': socio_json.get('SEND'),
                    'Complemento': None,  # Não disponível no JSON
                    'Bairro': socio_json.get('SBAIRRO'),
                    'CEP': formatar_cep(socio_json.get('SCEP')),
                    'Celular': None,  # Não disponível no JSON
                    'RedeSocial': None,  # Não disponível no JSON
                    'Pai': socio_json.get('SPAI'),
                    'Mae': socio_json.get('SMAE'),
                    'DataCadastro': converter_data(socio_json.get('SDTC')),
                    'Cadastrante': 'Sistema de Migração',
                    'Status': 'ATIVO' if socio_json.get('SATIV', True) else 'INATIVO',
                    'Matricula': socio_json.get('SMAT'),
                    'DataMensalidade': converter_data(socio_json.get('SDATMEN')),
                    'ValorMensalidade': socio_json.get('SVALORME'),
                    'DataAdmissao': converter_data(socio_json.get('SDTADMS')),
                    'CTPS': socio_json.get('SCTPS'),
                    'Funcao': socio_json.get('SFUNCAO'),
                    'CodEmpresa': cod_empresa,
                    'CNPJ': cnpj_empresa,
                    'RazaoSocial': razao_empresa,
                    'NomeFantasia': nome_fantasia,
                    'DataDemissao': converter_data(socio_json.get('SDTDEM')),
                    'MotivoDemissao': socio_json.get('SMOTDEM'),
                    'Carta': True if socio_json.get('SCARTA') else False,
                    'Carteira': True if socio_json.get('SCARTEIRA') else False,
                    'Ficha': True if socio_json.get('SFICHA') else False,
                    'Observacao': socio_json.get('SOBS'),
                    'Telefone': formatar_telefone(socio_json.get('SFONE'))
                }

                # Inserir sócio
                sql_insert = text(f'''
                    INSERT INTO "{SCHEMA}"."{TABLE}" (
                        "Nome", "RG", "Emissor", "CPF", "Nascimento", "Naturalidade", "NaturalidadeUF", "Nacionalidade", "Sexo", "EstadoCivil", "Endereco", "Complemento", "Bairro", "CEP", "Celular", "Rede Social", "Pai", "Mae", "DataCadastro", "Cadastrante", "Status", "Matricula", "DataMensalidade", "ValorMensalidade", "DataAdmissao", "CTPS", "Funcao", "CodEmpresa", "CNPJ", "RazaoSocial", "NomeFantasia", "DataDemissao", "MotivoDemissao", "Carta", "Carteira", "Ficha", "Observacao", "Telefone"
                    ) VALUES (
                        :Nome, :RG, :Emissor, :CPF, :Nascimento, :Naturalidade, :NaturalidadeUF, :Nacionalidade, :Sexo, :EstadoCivil, :Endereco, :Complemento, :Bairro, :CEP, :Celular, :RedeSocial, :Pai, :Mae, :DataCadastro, :Cadastrante, :Status, :Matricula, :DataMensalidade, :ValorMensalidade, :DataAdmissao, :CTPS, :Funcao, :CodEmpresa, :CNPJ, :RazaoSocial, :NomeFantasia, :DataDemissao, :MotivoDemissao, :Carta, :Carteira, :Ficha, :Observacao, :Telefone
                    )
                ''')
                
                conn.execute(sql_insert, dados_socio)
                conn.commit()
                total_migrados += 1
                print(f"  ✅ Migrado com sucesso")
                
            except Exception as e:
                total_erros += 1
                print(f"  ❌ Erro ao migrar sócio: {e}")
                # Não fazer rollback aqui, apenas continuar com o próximo

    print(f"\n🎉 Migração concluída!")
    print(f"✅ Total de sócios migrados: {total_migrados}")
    print(f"❌ Total de erros: {total_erros}")

def main():
    print("🚀 Iniciando migração de sócios do SINDPLAST")
    print("=" * 50)
    migrar_socios()
    print("=" * 50)
    print("🏁 Processo finalizado")

if __name__ == "__main__":
    main() 