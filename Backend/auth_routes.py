from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import check_password_hash
from datetime import timedelta
import datetime
from app import db
from models import Usuario

auth_bp = Blueprint('auth', __name__)

# Em produção, usar variável de ambiente
SECRET_KEY = 'sindplast-secret-key-change-in-production'

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        usuario_nome = data.get('usuario')
        senha = data.get('senha')
        
        if not usuario_nome or not senha:
            return jsonify({'success': False, 'message': 'Usuário e senha são obrigatórios'}), 400
        
        # Buscar usuário
        usuario = Usuario.query.filter_by(Usuario=usuario_nome).first()
        
        if usuario and check_password_hash(usuario.Senha, senha):
            # Criar tokens
            access_token = create_access_token(
                identity=usuario.IdUsuarios,
                expires_delta=timedelta(hours=8),
                additional_claims={
                    'nome': usuario.Nome,
                    'perfil': usuario.Perfil,
                    'funcao': usuario.Funcao
                }
            )
            
            refresh_token = create_refresh_token(identity=usuario.IdUsuarios)
            
            # Atualizar último login
            usuario.UltimoLogin = datetime.datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'success': True,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'usuario': {
                    'id': usuario.IdUsuarios,
                    'nome': usuario.Nome,
                    'usuario': usuario.Usuario,
                    'perfil': usuario.Perfil,
                    'funcao': usuario.Funcao,
                    'email': usuario.Email
                }
            }), 200
        else:
            return jsonify({'success': False, 'message': 'Usuário ou senha inválidos'}), 401
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro no login: {str(e)}'}), 500

@auth_bp.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        usuario = Usuario.query.get(current_user_id)
        
        if not usuario:
            return jsonify({'success': False, 'message': 'Usuário não encontrado'}), 404
            
        new_token = create_access_token(
            identity=current_user_id,
            expires_delta=timedelta(hours=8),
            additional_claims={
                'nome': usuario.Nome,
                'perfil': usuario.Perfil,
                'funcao': usuario.Funcao
            }
        )
        
        return jsonify({'access_token': new_token}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao renovar token: {str(e)}'}), 500

@auth_bp.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        # Aqui você pode adicionar o token a uma blacklist se necessário
        jti = get_jwt()['jti']
        # Adicionar à blacklist se implementar
        return jsonify({'success': True, 'message': 'Logout realizado com sucesso'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro no logout: {str(e)}'}), 500

@auth_bp.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        usuario = Usuario.query.get(current_user_id)
        
        if not usuario:
            return jsonify({'success': False, 'message': 'Usuário não encontrado'}), 404
            
        return jsonify({
            'success': True,
            'usuario': {
                'id': usuario.IdUsuarios,
                'nome': usuario.Nome,
                'usuario': usuario.Usuario,
                'perfil': usuario.Perfil,
                'funcao': usuario.Funcao,
                'email': usuario.Email
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao buscar usuário: {str(e)}'}), 500