from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import re
from sqlalchemy.exc import IntegrityError

# Inicializar o aplicativo Flask
app = Flask(__name__)
CORS(app)  # Habilitar CORS para integração com o frontend React

# Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://Sindplast:Sindplast@172.26.97.64:5432/Sindplast'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar o SQLAlchemy
db = SQLAlchemy(app)

# Modelos
class Empresa(db.Model):
    __tablename__ = 'Empresas'
    __table_args__ = {'schema': 'Sindplast'}
    
    IdEmpresa = db.Column(db.Integer, primary_key=True)
    CodEmpresa = db.Column(db.String(10))
    CNPJ = db.Column(db.String(18))
    RazaoSocial = db.Column(db.String(500))
    NomeFantasia = db.Column(db.String(500))
    Endereco = db.Column(db.String(500))
    Numero = db.Column(db.String(12))
    Complemento = db.Column(db.String(500))
    Bairro = db.Column(db.String(500))
    CEP = db.Column(db.String(10))
    Cidade = db.Column(db.String(500))
    UF = db.Column(db.String(2))
    Telefone01 = db.Column(db.String(15))
    Telefone02 = db.Column(db.String(15))
    Fax = db.Column(db.String(15))
    Celular = db.Column(db.String(15))
    WhatsApp = db.Column(db.String(15))
    Instagram = db.Column(db.String(200))
    Linkedin = db.Column(db.String(200))
    NFuncionarios = db.Column(db.Integer)
    DataContribuicao = db.Column(db.Date)
    ValorContribuicao = db.Column(db.Numeric(10, 2))
    DataCadastro = db.Column(db.DateTime)
    Cadastrante = db.Column(db.String(500))
    Observacao = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.IdEmpresa,
            'codEmpresa': self.CodEmpresa,
            'cnpj': self.CNPJ,
            'razaoSocial': self.RazaoSocial,
            'nomeFantasia': self.NomeFantasia,
            'endereco': self.Endereco,
            'numero': self.Numero,
            'complemento': self.Complemento,
            'bairro': self.Bairro,
            'cep': self.CEP,
            'cidade': self.Cidade,
            'uf': self.UF,
            'telefone01': self.Telefone01,
            'telefone02': self.Telefone02,
            'fax': self.Fax,
            'celular': self.Celular,
            'whatsapp': self.WhatsApp,
            'instagram': self.Instagram,
            'linkedin': self.Linkedin,
            'nFuncionarios': self.NFuncionarios,
            'dataContribuicao': self.DataContribuicao.isoformat() if self.DataContribuicao else None,
            'valorContribuicao': float(self.ValorContribuicao) if self.ValorContribuicao else None,
            'dataCadastro': self.DataCadastro.isoformat() if self.DataCadastro else None,
            'cadastrante': self.Cadastrante,
            'observacao': self.Observacao
        }

class Socio(db.Model):
    __tablename__ = 'Socios'
    __table_args__ = {'schema': 'Sindplast'}

    IdSocio = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(400))
    RG = db.Column(db.String(30))
    Emissor = db.Column(db.String(100))
    CPF = db.Column(db.String(14))
    Nascimento = db.Column(db.Date)
    Sexo = db.Column(db.String(100))
    Naturalidade = db.Column(db.String(200))
    NaturalidadeUF = db.Column(db.String(2))
    Nacionalidade = db.Column(db.String(150))
    EstadoCivil = db.Column(db.String(200))
    Endereco = db.Column(db.String(400))
    Complemento = db.Column(db.String(500))
    Bairro = db.Column(db.String(400))
    CEP = db.Column(db.String(9))
    Celular = db.Column(db.String(15))
    RedeSocial = db.Column('Rede Social', db.String(500))
    Pai = db.Column(db.String(400))
    Mae = db.Column(db.String(400))
    DataCadastro = db.Column(db.DateTime)
    Cadastrante = db.Column(db.String(300))
    Status = db.Column(db.String(20))
    # Campos adicionais da tabela Socios
    Matricula = db.Column(db.String(50))
    DataMensalidade = db.Column(db.Date)
    ValorMensalidade = db.Column(db.Numeric(10, 2))
    DataAdmissao = db.Column(db.Date)
    CTPS = db.Column(db.String(50))
    Funcao = db.Column(db.String(200))
    CodEmpresa = db.Column(db.String(10))
    CNPJ = db.Column(db.String(18))
    RazaoSocial = db.Column(db.String(500))
    NomeFantasia = db.Column(db.String(500))
    DataDemissao = db.Column(db.Date)
    MotivoDemissao = db.Column(db.String(500))
    Carta = db.Column(db.Boolean)
    Carteira = db.Column(db.Boolean)
    Ficha = db.Column(db.Boolean)
    Observacao = db.Column(db.Text)
    Telefone = db.Column(db.String(15))
    
    def to_dict(self):
        return {
            'id': self.IdSocio,
            'nome': self.Nome,
            'rg': self.RG,
            'emissor': self.Emissor,
            'cpf': self.CPF,
            'nascimento': self.Nascimento.isoformat() if self.Nascimento else None,
            'sexo': self.Sexo,
            'naturalidade': self.Naturalidade,
            'naturalidadeUF': self.NaturalidadeUF,
            'nacionalidade': self.Nacionalidade,
            'estadoCivil': self.EstadoCivil,
            'endereco': self.Endereco,
            'complemento': self.Complemento,
            'bairro': self.Bairro,
            'cep': self.CEP,
            'celular': self.Celular,
            'redeSocial': self.RedeSocial,
            'pai': self.Pai,
            'mae': self.Mae,
            'dataCadastro': self.DataCadastro.isoformat() if self.DataCadastro else None,
            'cadastrante': self.Cadastrante,
            'status': self.Status,
            # Campos adicionais
            'matricula': self.Matricula,
            'dataMensalidade': self.DataMensalidade.isoformat() if self.DataMensalidade else None,
            'valorMensalidade': float(self.ValorMensalidade) if self.ValorMensalidade else None,
            'dataAdmissao': self.DataAdmissao.isoformat() if self.DataAdmissao else None,
            'ctps': self.CTPS,
            'funcao': self.Funcao,
            'codEmpresa': self.CodEmpresa,
            'cnpj': self.CNPJ,
            'razaoSocial': self.RazaoSocial,
            'nomeFantasia': self.NomeFantasia,
            'dataDemissao': self.DataDemissao.isoformat() if self.DataDemissao else None,
            'motivoDemissao': self.MotivoDemissao,
            'carta': self.Carta,
            'carteira': self.Carteira,
            'ficha': self.Ficha,
            'observacao': self.Observacao,
            'telefone': self.Telefone
        }

class Funcionario(db.Model):
    __tablename__ = 'Funcionarios'
    __table_args__ = {'schema': 'Sindplast'}
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    cargo = db.Column(db.String(50))
    data_admissao = db.Column(db.Date)
    salario = db.Column(db.Float)
    empresa_id = db.Column(db.Integer, db.ForeignKey('Sindplast.Empresas.IdEmpresa'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cpf': self.cpf,
            'cargo': self.cargo,
            'data_admissao': self.data_admissao.isoformat() if self.data_admissao else None,
            'salario': self.salario,
            'empresa_id': self.empresa_id
        }

class Usuario(db.Model):
    __tablename__ = 'Usuarios'
    __table_args__ = {'schema': 'Sindplast'}

    IdUsuarios = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(300), unique=True)
    CPF = db.Column(db.String(14), unique=True)
    Funcao = db.Column(db.String(300), unique=True)
    Email = db.Column(db.String(400), unique=True)
    Usuario = db.Column(db.String(200), unique=True)
    Senha = db.Column(db.String(200), unique=True)
    Perfil = db.Column(db.String(300), unique=True)
    Cadastrante = db.Column(db.String(400), nullable=False)
    DataCadastro = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'IdUsuarios': self.IdUsuarios,
            'Nome': self.Nome,
            'CPF': self.CPF,
            'Funcao': self.Funcao,
            'Email': self.Email,
            'Usuario': self.Usuario,
            'Perfil': self.Perfil,
            'Cadastrante': self.Cadastrante,
            'DataCadastro': self.DataCadastro.isoformat() if self.DataCadastro else None
        }

# Modelo Perfil
class Perfil(db.Model):
    __tablename__ = 'Perfil'
    __table_args__ = {'schema': 'Sindplast'}

    IdPerfil = db.Column(db.Integer, primary_key=True)
    Perfil = db.Column(db.String(50), unique=True, nullable=False)
    Descricao = db.Column(db.String(255))
    DataCadastro = db.Column(db.DateTime, default=datetime.utcnow)
    Cadastrante = db.Column(db.String(100))

    def to_dict(self):
        return {
            'IdPerfil': self.IdPerfil,
            'Perfil': self.Perfil,
            'Descricao': self.Descricao,
            'DataCadastro': self.DataCadastro.isoformat() if self.DataCadastro else None,
            'Cadastrante': self.Cadastrante
        }

# Modelo Permissoes
class Permissoes(db.Model):
    __tablename__ = 'Permissoes'
    __table_args__ = {'schema': 'Sindplast'}

    IdPermissao = db.Column(db.Integer, primary_key=True)
    Nome = db.Column(db.String(50), unique=True, nullable=False)
    Descricao = db.Column(db.String(255))
    Tela = db.Column(db.String(100))
    DataCadastro = db.Column(db.DateTime, default=datetime.utcnow)
    Cadastrante = db.Column(db.String(100))

    def to_dict(self):
        return {
            'IdPermissao': self.IdPermissao,
            'Nome': self.Nome,
            'Descricao': self.Descricao,
            'Tela': self.Tela,
            'DataCadastro': self.DataCadastro.isoformat() if self.DataCadastro else None,
            'Cadastrante': self.Cadastrante
        }

# Modelo PerfilPermissao
class PerfilPermissao(db.Model):
    __tablename__ = 'PerfilPermissao'
    __table_args__ = {'schema': 'Sindplast'}
    IdPerfil = db.Column(db.Integer, db.ForeignKey('Sindplast.Perfil.IdPerfil'), primary_key=True)
    IdPermissao = db.Column(db.Integer, db.ForeignKey('Sindplast.Permissoes.IdPermissao'), primary_key=True)

# Criar as tabelas no banco de dados
# with app.app_context():
#     db.create_all()

# Rotas para empresas
@app.route('/api/empresas', methods=['GET'])
def get_empresas():
    empresas = Empresa.query.all()
    return jsonify([empresa.to_dict() for empresa in empresas])

@app.route('/api/empresas/<int:id>', methods=['GET'])
def get_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    return jsonify(empresa.to_dict())

@app.route('/api/empresas', methods=['POST'])
def create_empresa():
    data = request.json
    empresa = Empresa(
        CodEmpresa=data.get('codEmpresa'),
        CNPJ=data.get('cnpj'),
        RazaoSocial=data.get('razaoSocial'),
        NomeFantasia=data.get('nomeFantasia'),
        Endereco=data.get('endereco'),
        Numero=data.get('numero'),
        Complemento=data.get('complemento'),
        Bairro=data.get('bairro'),
        CEP=data.get('cep'),
        Cidade=data.get('cidade'),
        UF=data.get('uf'),
        Telefone01=data.get('telefone01'),
        Telefone02=data.get('telefone02'),
        Fax=data.get('fax'),
        Celular=data.get('celular'),
        WhatsApp=data.get('whatsapp'),
        Instagram=data.get('instagram'),
        Linkedin=data.get('linkedin'),
        NFuncionarios=data.get('nFuncionarios'),
        DataContribuicao=data.get('dataContribuicao'),
        ValorContribuicao=data.get('valorContribuicao'),
        DataCadastro=data.get('dataCadastro'),
        Cadastrante=data.get('cadastrante'),
        Observacao=data.get('observacao')
    )
    db.session.add(empresa)
    db.session.commit()
    return jsonify(empresa.to_dict()), 201

@app.route('/api/empresas/<int:id>', methods=['PUT'])
def update_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    data = request.json
    
    if 'codEmpresa' in data:
        empresa.CodEmpresa = data['codEmpresa']
    if 'cnpj' in data:
        empresa.CNPJ = data['cnpj']
    if 'razaoSocial' in data:
        empresa.RazaoSocial = data['razaoSocial']
    if 'nomeFantasia' in data:
        empresa.NomeFantasia = data['nomeFantasia']
    if 'endereco' in data:
        empresa.Endereco = data['endereco']
    if 'numero' in data:
        empresa.Numero = data['numero']
    if 'complemento' in data:
        empresa.Complemento = data['complemento']
    if 'bairro' in data:
        empresa.Bairro = data['bairro']
    if 'cep' in data:
        empresa.CEP = data['cep']
    if 'cidade' in data:
        empresa.Cidade = data['cidade']
    if 'uf' in data:
        empresa.UF = data['uf']
    if 'telefone01' in data:
        empresa.Telefone01 = data['telefone01']
    if 'telefone02' in data:
        empresa.Telefone02 = data['telefone02']
    if 'fax' in data:
        empresa.Fax = data['fax']
    if 'celular' in data:
        empresa.Celular = data['celular']
    if 'whatsapp' in data:
        empresa.WhatsApp = data['whatsapp']
    if 'instagram' in data:
        empresa.Instagram = data['instagram']
    if 'linkedin' in data:
        empresa.Linkedin = data['linkedin']
    if 'nFuncionarios' in data:
        empresa.NFuncionarios = data['nFuncionarios']
    if 'dataContribuicao' in data:
        empresa.DataContribuicao = data['dataContribuicao']
    if 'valorContribuicao' in data:
        empresa.ValorContribuicao = data['valorContribuicao']
    if 'dataCadastro' in data:
        empresa.DataCadastro = data['dataCadastro']
    if 'cadastrante' in data:
        empresa.Cadastrante = data['cadastrante']
    if 'observacao' in data:
        empresa.Observacao = data['observacao']
    
    db.session.commit()
    return jsonify(empresa.to_dict())

@app.route('/api/empresas/<int:id>', methods=['DELETE'])
def delete_empresa(id):
    empresa = Empresa.query.get_or_404(id)
    db.session.delete(empresa)
    db.session.commit()
    return '', 204

# Rotas para sócios
@app.route('/api/socios', methods=['GET'])
def get_socios():
    try:
        socios = Socio.query.all()
        return jsonify([socio.to_dict() for socio in socios])
    except Exception as e:
        return jsonify({'message': f'Erro ao buscar sócios: {str(e)}'}), 500

@app.route('/api/socios/<int:id>', methods=['GET'])
def get_socio(id):
    try:
        socio = Socio.query.filter_by(IdSocio=id).first_or_404()
        return jsonify(socio.to_dict())
    except Exception as e:
        return jsonify({'message': f'Erro ao buscar sócio: {str(e)}'}), 500

@app.route('/api/socios', methods=['POST'])
def create_socio():
    try:
        data = request.json
        
        # Validações básicas
        if not data.get('nome'):
            return jsonify({'message': 'Nome é obrigatório'}), 400

        # Criar sócio com todos os campos disponíveis
        socio = Socio(
            Nome=data.get('nome'),
            RG=data.get('rg'),
            Emissor=data.get('emissor'),
            CPF=data.get('cpf'),
            Nascimento=datetime.strptime(data.get('nascimento'), '%Y-%m-%d').date() if data.get('nascimento') else None,
            Sexo=data.get('sexo'),
            Naturalidade=data.get('naturalidade'),
            NaturalidadeUF=data.get('naturalidadeUF'),
            Nacionalidade=data.get('nacionalidade'),
            EstadoCivil=data.get('estadoCivil'),
            Endereco=data.get('endereco'),
            Complemento=data.get('complemento'),
            Bairro=data.get('bairro'),
            CEP=data.get('cep'),
            Celular=data.get('celular'),
            RedeSocial=data.get('redeSocial'),
            Pai=data.get('pai'),
            Mae=data.get('mae'),
            DataCadastro=datetime.utcnow(),
            Cadastrante=data.get('cadastrante'),
            Status=data.get('status'),
            # Campos adicionais
            Matricula=data.get('matricula'),
            DataMensalidade=datetime.strptime(data.get('dataMensalidade'), '%Y-%m-%d').date() if data.get('dataMensalidade') else None,
            ValorMensalidade=data.get('valorMensalidade'),
            DataAdmissao=datetime.strptime(data.get('dataAdmissao'), '%Y-%m-%d').date() if data.get('dataAdmissao') else None,
            CTPS=data.get('ctps'),
            Funcao=data.get('funcao'),
            CodEmpresa=data.get('codEmpresa'),
            CNPJ=data.get('cnpj'),
            RazaoSocial=data.get('razaoSocial'),
            NomeFantasia=data.get('nomeFantasia'),
            DataDemissao=datetime.strptime(data.get('dataDemissao'), '%Y-%m-%d').date() if data.get('dataDemissao') else None,
            MotivoDemissao=data.get('motivoDemissao'),
            Carta=data.get('carta'),
            Carteira=data.get('carteira'),
            Ficha=data.get('ficha'),
            Observacao=data.get('observacao'),
            Telefone=data.get('telefone')
        )

        db.session.add(socio)
        db.session.commit()
        return jsonify(socio.to_dict()), 201

    except IntegrityError as e:
        db.session.rollback()
        error_msg = str(e)
        if 'socio_cpf_key' in error_msg:
            return jsonify({'message': 'Já existe um sócio com este CPF'}), 400
        return jsonify({'message': 'Erro de integridade ao criar sócio'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao criar sócio: {str(e)}'}), 500

@app.route('/api/socios/<int:id>', methods=['PUT'])
def update_socio(id):
    try:
        socio = Socio.query.filter_by(IdSocio=id).first_or_404()
        data = request.json

        # Validações básicas
        if not data.get('nome'):
            return jsonify({'message': 'Nome é obrigatório'}), 400

        # Atualizar todos os campos disponíveis
        socio.Nome = data.get('nome', socio.Nome)
        socio.RG = data.get('rg', socio.RG)
        socio.Emissor = data.get('emissor', socio.Emissor)
        socio.CPF = data.get('cpf', socio.CPF)
        socio.Nascimento = datetime.strptime(data.get('nascimento'), '%Y-%m-%d').date() if data.get('nascimento') else socio.Nascimento
        socio.Sexo = data.get('sexo', socio.Sexo)
        socio.Naturalidade = data.get('naturalidade', socio.Naturalidade)
        socio.NaturalidadeUF = data.get('naturalidadeUF', socio.NaturalidadeUF)
        socio.Nacionalidade = data.get('nacionalidade', socio.Nacionalidade)
        socio.EstadoCivil = data.get('estadoCivil', socio.EstadoCivil)
        socio.Endereco = data.get('endereco', socio.Endereco)
        socio.Complemento = data.get('complemento', socio.Complemento)
        socio.Bairro = data.get('bairro', socio.Bairro)
        socio.CEP = data.get('cep', socio.CEP)
        socio.Celular = data.get('celular', socio.Celular)
        socio.RedeSocial = data.get('redeSocial', socio.RedeSocial)
        socio.Pai = data.get('pai', socio.Pai)
        socio.Mae = data.get('mae', socio.Mae)
        socio.Cadastrante = data.get('cadastrante', socio.Cadastrante)
        socio.Status = data.get('status', socio.Status)
        # Campos adicionais
        socio.Matricula = data.get('matricula', socio.Matricula)
        socio.DataMensalidade = datetime.strptime(data.get('dataMensalidade'), '%Y-%m-%d').date() if data.get('dataMensalidade') else socio.DataMensalidade
        socio.ValorMensalidade = data.get('valorMensalidade', socio.ValorMensalidade)
        socio.DataAdmissao = datetime.strptime(data.get('dataAdmissao'), '%Y-%m-%d').date() if data.get('dataAdmissao') else socio.DataAdmissao
        socio.CTPS = data.get('ctps', socio.CTPS)
        socio.Funcao = data.get('funcao', socio.Funcao)
        socio.CodEmpresa = data.get('codEmpresa', socio.CodEmpresa)
        socio.CNPJ = data.get('cnpj', socio.CNPJ)
        socio.RazaoSocial = data.get('razaoSocial', socio.RazaoSocial)
        socio.NomeFantasia = data.get('nomeFantasia', socio.NomeFantasia)
        socio.DataDemissao = datetime.strptime(data.get('dataDemissao'), '%Y-%m-%d').date() if data.get('dataDemissao') else socio.DataDemissao
        socio.MotivoDemissao = data.get('motivoDemissao', socio.MotivoDemissao)
        socio.Carta = data.get('carta', socio.Carta)
        socio.Carteira = data.get('carteira', socio.Carteira)
        socio.Ficha = data.get('ficha', socio.Ficha)
        socio.Observacao = data.get('observacao', socio.Observacao)
        socio.Telefone = data.get('telefone', socio.Telefone)

        db.session.commit()
        return jsonify(socio.to_dict())

    except IntegrityError as e:
        db.session.rollback()
        error_msg = str(e)
        if 'socio_cpf_key' in error_msg:
            return jsonify({'message': 'Já existe um sócio com este CPF'}), 400
        return jsonify({'message': 'Erro de integridade ao atualizar sócio'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar sócio: {str(e)}'}), 500

@app.route('/api/socios/<int:id>', methods=['DELETE'])
def delete_socio(id):
    try:
        socio = Socio.query.filter_by(IdSocio=id).first_or_404()
        db.session.delete(socio)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao excluir sócio: {str(e)}'}), 500

# Rotas para Usuários
@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    try:
        usuarios = Usuario.query.all()
        return jsonify([usuario.to_dict() for usuario in usuarios])
    except Exception as e:
        return jsonify({'message': f'Erro ao buscar usuários: {str(e)}'}), 500

@app.route('/api/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    try:
        usuario = Usuario.query.get_or_404(id)
        return jsonify(usuario.to_dict())
    except Exception as e:
        return jsonify({'message': f'Erro ao buscar usuário: {str(e)}'}), 500

@app.route('/api/usuarios', methods=['POST'])
def create_usuario():
    try:
        data = request.json
        
        # Validações básicas
        if not data.get('Nome'):
            return jsonify({'message': 'Nome é obrigatório'}), 400
        if not data.get('Email'):
            return jsonify({'message': 'Email é obrigatório'}), 400
        if not data.get('Cadastrante'):
            return jsonify({'message': 'Cadastrante é obrigatório'}), 400

        # Processar CPF e Usuario
        cpf = data.get('CPF', '')
        usuario_valor = data.get('Usuario') or re.sub(r'\D', '', cpf)
        senha_valor = data.get('Senha') or '123456'

        # Criar usuário
        usuario = Usuario(
            Nome=data['Nome'],
            CPF=cpf,
            Funcao=data.get('Funcao'),
            Email=data['Email'],
            Usuario=usuario_valor,
            Senha=generate_password_hash(senha_valor),
            Perfil=data.get('Perfil'),
            Cadastrante=data['Cadastrante'],
            DataCadastro=datetime.utcnow()
        )

        db.session.add(usuario)
        db.session.commit()
        return jsonify(usuario.to_dict()), 201

    except IntegrityError as e:
        db.session.rollback()
        error_msg = str(e)
        if 'usuarios_nome_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este nome'}), 400
        if 'usuarios_cpf_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este CPF'}), 400
        if 'usuarios_email_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este email'}), 400
        if 'usuarios_usuario_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este nome de usuário'}), 400
        return jsonify({'message': 'Erro de integridade ao criar usuário'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao criar usuário: {str(e)}'}), 500

@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    try:
        usuario = Usuario.query.get_or_404(id)
        data = request.json

        # Validações básicas
        if not data.get('Nome'):
            return jsonify({'message': 'Nome é obrigatório'}), 400
        if not data.get('Email'):
            return jsonify({'message': 'Email é obrigatório'}), 400
        if not data.get('Cadastrante'):
            return jsonify({'message': 'Cadastrante é obrigatório'}), 400

        # Atualizar campos
        usuario.Nome = data['Nome']
        usuario.CPF = data.get('CPF', usuario.CPF)
        usuario.Funcao = data.get('Funcao', usuario.Funcao)
        usuario.Email = data['Email']
        usuario.Usuario = data.get('Usuario', usuario.Usuario)
        if 'Senha' in data:
            usuario.Senha = generate_password_hash(data['Senha'])
        usuario.Perfil = data.get('Perfil', usuario.Perfil)
        usuario.Cadastrante = data['Cadastrante']

        db.session.commit()
        return jsonify(usuario.to_dict())

    except IntegrityError as e:
        db.session.rollback()
        error_msg = str(e)
        if 'usuarios_nome_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este nome'}), 400
        if 'usuarios_cpf_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este CPF'}), 400
        if 'usuarios_email_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este email'}), 400
        if 'usuarios_usuario_key' in error_msg:
            return jsonify({'message': 'Já existe um usuário com este nome de usuário'}), 400
        return jsonify({'message': 'Erro de integridade ao atualizar usuário'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar usuário: {str(e)}'}), 500

@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    try:
        usuario = Usuario.query.get_or_404(id)
        db.session.delete(usuario)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao excluir usuário: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    usuario = Usuario.query.filter_by(Usuario=data['Usuario']).first()
    if usuario and check_password_hash(usuario.Senha, data['Senha']):
        return jsonify({'success': True, 'usuario': usuario.to_dict()})
    return jsonify({'success': False, 'message': 'Usuário ou senha inválidos'}), 401

# Função para criar usuário Admin padrão
with app.app_context():
    db.create_all()
    if not Usuario.query.filter_by(Usuario='Admin').first():
        admin = Usuario(
            Nome='Administrador',
            Usuario='Admin',
            Email='admin@sindplast.com',
            Senha=generate_password_hash('Sindplast'),
            Perfil='Administrador',
            Cadastrante='Sistema',
            DataCadastro=datetime.utcnow()
        )
        db.session.add(admin)
        db.session.commit()

# Rota para o status da API
@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        'status': 'online',
        'name': 'SINDPLAST-AM API',
        'version': '1.0.0'
    })

@app.route('/')
def index():
    # Filtrar apenas rotas GET sem parâmetros
    routes = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static' and 'GET' in rule.methods and '<' not in rule.rule:
            routes.append({
                'endpoint': rule.endpoint,
                'rule': str(rule)
            })

    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>APIs do SINDPLAST</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; }
            .container { max-width: 1100px; margin: 40px auto; background: #fff; padding: 0; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); display: flex; min-height: 600px; }
            .sidebar { width: 30%; min-width: 220px; max-width: 320px; background: #f7f9fa; border-right: 1px solid #e0e0e0; padding: 32px 24px; border-radius: 12px 0 0 12px; }
            .main { flex: 1; padding: 32px 36px; }
            h1 { color: #1a237e; font-size: 2.1rem; margin-bottom: 24px; }
            .api-list { margin: 0; padding: 0; list-style: none; }
            .api-item { margin-bottom: 18px; }
            .api-link { color: #1565c0; cursor: pointer; text-decoration: none; font-size: 1.08rem; display: block; padding: 8px 12px; border-radius: 6px; transition: background 0.2s; }
            .api-link:hover, .api-link.selected { background: #e3eafc; color: #0d47a1; font-weight: bold; }
            .result-title { color: #1a237e; font-size: 1.2rem; margin-bottom: 12px; }
            pre { background: #f3f3f3; padding: 18px; border-radius: 8px; font-size: 1.05rem; min-height: 200px; }
            @media (max-width: 900px) {
                .container { flex-direction: column; }
                .sidebar { border-radius: 12px 12px 0 0; border-right: none; border-bottom: 1px solid #e0e0e0; width: 100%; max-width: 100%; }
                .main { padding: 24px 12px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="sidebar">
                <h1>APIs GET</h1>
                <ul class="api-list">
                    {% for route in routes %}
                        <li class="api-item">
                            <a class="api-link" href="#" onclick="selectApi('{{ route.rule }}', this); return false;">{{ route.rule }}</a>
                        </li>
                    {% endfor %}
                </ul>
            </div>
            <div class="main">
                <div class="result-title">Resultado da API selecionada:</div>
                <pre id="api-data">Selecione uma API GET à esquerda para ver os dados retornados.</pre>
            </div>
        </div>
        <script>
            let selectedLink = null;
            function selectApi(route, el) {
                if (selectedLink) selectedLink.classList.remove('selected');
                el.classList.add('selected');
                selectedLink = el;
                document.getElementById('api-data').textContent = 'Consultando...';
                fetch(route)
                    .then(resp => resp.json())
                    .then(data => {
                        document.getElementById('api-data').textContent = JSON.stringify(data, null, 2);
                    })
                    .catch(err => {
                        document.getElementById('api-data').textContent = 'Erro ao consultar a API: ' + err;
                    });
            }
        </script>
    </body>
    </html>
    '''
    return render_template_string(html, routes=routes)

@app.route('/api')
def api_index():
    # Filtrar apenas rotas GET sem parâmetros
    routes = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static' and 'GET' in rule.methods and '<' not in rule.rule:
            routes.append({
                'endpoint': rule.endpoint,
                'rule': str(rule)
            })

    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>APIs do SINDPLAST</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; }
            .container { max-width: 1100px; margin: 40px auto; background: #fff; padding: 0; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); display: flex; min-height: 600px; }
            .sidebar { width: 30%; min-width: 220px; max-width: 320px; background: #f7f9fa; border-right: 1px solid #e0e0e0; padding: 32px 24px; border-radius: 12px 0 0 12px; }
            .main { flex: 1; padding: 32px 36px; }
            h1 { color: #1a237e; font-size: 2.1rem; margin-bottom: 24px; }
            .api-list { margin: 0; padding: 0; list-style: none; }
            .api-item { margin-bottom: 18px; }
            .api-link { color: #1565c0; cursor: pointer; text-decoration: none; font-size: 1.08rem; display: block; padding: 8px 12px; border-radius: 6px; transition: background 0.2s; }
            .api-link:hover, .api-link.selected { background: #e3eafc; color: #0d47a1; font-weight: bold; }
            .result-title { color: #1a237e; font-size: 1.2rem; margin-bottom: 12px; }
            pre { background: #f3f3f3; padding: 18px; border-radius: 8px; font-size: 1.05rem; min-height: 200px; }
            @media (max-width: 900px) {
                .container { flex-direction: column; }
                .sidebar { border-radius: 12px 12px 0 0; border-right: none; border-bottom: 1px solid #e0e0e0; width: 100%; max-width: 100%; }
                .main { padding: 24px 12px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="sidebar">
                <h1>APIs GET</h1>
                <ul class="api-list">
                    {% for route in routes %}
                        <li class="api-item">
                            <a class="api-link" href="#" onclick="selectApi('{{ route.rule }}', this); return false;">{{ route.rule }}</a>
                        </li>
                    {% endfor %}
                </ul>
            </div>
            <div class="main">
                <div class="result-title">Resultado da API selecionada:</div>
                <pre id="api-data">Selecione uma API GET à esquerda para ver os dados retornados.</pre>
            </div>
        </div>
        <script>
            let selectedLink = null;
            function selectApi(route, el) {
                if (selectedLink) selectedLink.classList.remove('selected');
                el.classList.add('selected');
                selectedLink = el;
                document.getElementById('api-data').textContent = 'Consultando...';
                fetch(route)
                    .then(resp => resp.json())
                    .then(data => {
                        document.getElementById('api-data').textContent = JSON.stringify(data, null, 2);
                    })
                    .catch(err => {
                        document.getElementById('api-data').textContent = 'Erro ao consultar a API: ' + err;
                    });
            }
        </script>
    </body>
    </html>
    '''
    return render_template_string(html, routes=routes)

# Rotas para Perfil
@app.route('/api/perfis', methods=['GET'])
def get_perfis():
    try:
        perfis = Perfil.query.all()
        return jsonify([perfil.to_dict() for perfil in perfis])
    except Exception as e:
        print(f"Erro ao listar perfis: {str(e)}")
        return jsonify({'message': f'Erro ao listar perfis: {str(e)}'}), 500

@app.route('/api/perfis/<int:id>', methods=['GET'])
def get_perfil(id):
    perfil = Perfil.query.get_or_404(id)
    return jsonify(perfil.to_dict())

@app.route('/api/perfis', methods=['POST'])
def create_perfil():
    try:
        data = request.json
        print(f"Dados recebidos: {data}")
        
        if not data.get('Perfil') and not data.get('Nome'):
            # Compatibilidade: aceita Nome ou Perfil
            return jsonify({'message': 'Perfil é obrigatório'}), 400
            
        if not data.get('Cadastrante'):
            return jsonify({'message': 'Cadastrante é obrigatório'}), 400
            
        # Se vier Nome no lugar de Perfil, usar Nome
        nome_perfil = data.get('Perfil') or data.get('Nome')
        
        perfil = Perfil(
            Perfil=nome_perfil,
            Descricao=data.get('Descricao'),
            Cadastrante=data.get('Cadastrante'),
            DataCadastro=datetime.utcnow()
        )
        
        db.session.add(perfil)
        db.session.commit()
        return jsonify(perfil.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar perfil: {str(e)}")
        return jsonify({'message': f'Erro ao criar perfil: {str(e)}'}), 500

@app.route('/api/perfis/<int:id>', methods=['PUT'])
def update_perfil(id):
    perfil = Perfil.query.get_or_404(id)
    data = request.json
    if not data.get('Perfil'):
        return jsonify({'message': 'Perfil é obrigatório'}), 400
    if not data.get('Cadastrante'):
        return jsonify({'message': 'Cadastrante é obrigatório'}), 400
    perfil.Perfil = data['Perfil']
    perfil.Descricao = data.get('Descricao', perfil.Descricao)
    perfil.Cadastrante = data['Cadastrante']
    db.session.commit()
    return jsonify(perfil.to_dict())

@app.route('/api/perfis/<int:id>', methods=['DELETE'])
def delete_perfil(id):
    perfil = Perfil.query.get_or_404(id)
    db.session.delete(perfil)
    db.session.commit()
    return '', 204

# Rotas para Permissoes
@app.route('/api/permissoes', methods=['GET'])
def get_permissoes():
    permissoes = Permissoes.query.all()
    return jsonify([p.to_dict() for p in permissoes])

@app.route('/api/permissoes/<int:id>', methods=['GET'])
def get_permissao(id):
    permissao = Permissoes.query.get_or_404(id)
    return jsonify(permissao.to_dict())

@app.route('/api/permissoes', methods=['POST'])
def create_permissao():
    data = request.json
    if not data.get('Nome'):
        return jsonify({'message': 'Nome é obrigatório'}), 400
    if not data.get('Cadastrante'):
        return jsonify({'message': 'Cadastrante é obrigatório'}), 400
    permissao = Permissoes(
        Nome=data['Nome'],
        Descricao=data.get('Descricao'),
        Cadastrante=data['Cadastrante'],
        DataCadastro=datetime.utcnow()
    )
    db.session.add(permissao)
    db.session.commit()
    return jsonify(permissao.to_dict()), 201

@app.route('/api/permissoes/<int:id>', methods=['PUT'])
def update_permissao(id):
    permissao = Permissoes.query.get_or_404(id)
    data = request.json
    if not data.get('Nome'):
        return jsonify({'message': 'Nome é obrigatório'}), 400
    if not data.get('Cadastrante'):
        return jsonify({'message': 'Cadastrante é obrigatório'}), 400
    permissao.Nome = data['Nome']
    permissao.Descricao = data.get('Descricao', permissao.Descricao)
    permissao.Cadastrante = data['Cadastrante']
    db.session.commit()
    return jsonify(permissao.to_dict())

@app.route('/api/permissoes/<int:id>', methods=['DELETE'])
def delete_permissao(id):
    permissao = Permissoes.query.get_or_404(id)
    db.session.delete(permissao)
    db.session.commit()
    return '', 204

# Endpoint para listar perfis associados a uma permissão
@app.route('/api/permissoes/<int:id>/perfis', methods=['GET'])
def get_perfis_por_permissao(id):
    perfis = db.session.query(Perfil).join(PerfilPermissao, Perfil.IdPerfil == PerfilPermissao.IdPerfil).filter(PerfilPermissao.IdPermissao == id).all()
    return jsonify([p.to_dict() for p in perfis])

# Endpoint para atualizar perfis associados a uma permissão
@app.route('/api/permissoes/<int:id>/perfis', methods=['PUT'])
def update_perfis_por_permissao(id):
    data = request.json
    ids_perfis = data.get('ids_perfis', [])
    # Remove todos os vínculos atuais
    PerfilPermissao.query.filter_by(IdPermissao=id).delete()
    # Adiciona os novos vínculos
    for id_perfil in ids_perfis:
        db.session.add(PerfilPermissao(IdPerfil=id_perfil, IdPermissao=id))
    db.session.commit()
    return jsonify({'message': 'Perfis atualizados para a permissão.'})

if __name__ == '__main__':
    app.run(debug=True) 