import sys
# When running as `python app.py`, Python loads this file as the module
# `__main__`. Any later `from app import ...` would NOT find `app` in
# sys.modules and would re-execute this file, creating a duplicate Flask
# instance. Alias ourselves so future imports of `app` return the same module.
if __name__ == '__main__':
    sys.modules['app'] = sys.modules[__name__]

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')
jwt = JWTManager(app)

supabase: Client = create_client(os.getenv('DATABASE_URL'), os.getenv('DATABASE_KEY'))

if __name__ == '__main__':
    import auth
    import dashboard
    import documents
    app.run(debug=True)
