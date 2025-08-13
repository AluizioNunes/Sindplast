import requests
import json

# URL da API
base_url = 'http://localhost:5000/api'

def test_create_perfil():
    """Testa a criação de um perfil via API"""
    url = f'{base_url}/perfis'
    data = {
        'Perfil': 'PERFIL DE TESTE',
        'Descricao': 'Perfil criado para teste da API',
        'Cadastrante': 'SISTEMA'
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200 or response.status_code == 201:
            print(f"Resposta: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"Erro: {response.text}")
        
        return response.json() if response.status_code in (200, 201) else None
    except Exception as e:
        print(f"Erro na requisição: {str(e)}")
        return None

def test_list_perfis():
    """Testa a listagem de perfis via API"""
    url = f'{base_url}/perfis'
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Perfis cadastrados: {len(data)}")
            for perfil in data:
                print(f"ID: {perfil.get('IdPerfil')}, Perfil: {perfil.get('Perfil')}")
            return data
        else:
            print(f"Erro: {response.text}")
            return None
    except requests.exceptions.JSONDecodeError:
        print(f"Erro ao decodificar JSON: {response.text}")
        return None
    except Exception as e:
        print(f"Erro na requisição: {str(e)}")
        return None

if __name__ == "__main__":
    try:
        print("=== TESTANDO CRIAÇÃO DE PERFIL ===")
        created_perfil = test_create_perfil()
        
        print("\n=== TESTANDO LISTAGEM DE PERFIS ===")
        perfis = test_list_perfis()
        
        if perfis:
            print("\nAPI de Perfil está funcionando corretamente!")
        else:
            print("\nHá problemas com a API de Perfil!")
    except Exception as e:
        print(f"Erro geral nos testes: {str(e)}") 