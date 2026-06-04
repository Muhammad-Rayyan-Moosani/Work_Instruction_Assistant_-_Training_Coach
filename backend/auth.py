from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app import app, supabase
import bcrypt

@app.route('/authentication', methods=['POST'])
def auth():
    try:
        frontend_data = request.get_json()
        typed_username = frontend_data.get('username')
        typed_password = frontend_data.get('password')
        response = supabase.table('users').select('*').eq('username', typed_username).execute()
        if not response.data:
            return jsonify({"login_status": "User not found"}), 404

        hashed_password = response.data[0]['password_hash']

    except Exception as e:
        return jsonify({"db_error": str(e)}), 500

    user = response.data[0]
    if bcrypt.checkpw(typed_password.encode(), hashed_password.encode()):
        token = create_access_token(
            identity=str(user['user_id']),
            additional_claims={'role': user['role'], 'username': user['username']}
        )
        return jsonify({'token': token, 'role': user['role']}), 200
    else:
        return jsonify({"login_status": "Password incorrect"}), 401
