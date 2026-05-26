from flask import Blueprint, jsonify, request

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Flask API is running'
    }), 200

@api.route('/example', methods=['GET'])
def get_example():
    """Example GET endpoint"""
    return jsonify({
        'message': 'This is an example endpoint',
        'data': []
    }), 200

@api.route('/example', methods=['POST'])
def post_example():
    """Example POST endpoint"""
    data = request.get_json()
    return jsonify({
        'message': 'Data received',
        'received': data
    }), 201
