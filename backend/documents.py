from flask import request, jsonify
from app import app, supabase

@app.route('/documents', methods=['POST'])
def documents():
    # With FormData (multipart), text fields are in request.form and the
    # uploaded file is in request.files — NOT in request.get_json().
    uploaded_file = request.files.get('file')
    if uploaded_file is None:
        return jsonify({'error': 'No file received'}), 400

    title       = request.form.get('Title')
    group_name  = request.form.get('Group')
    version     = request.form.get('Version')
    status      = request.form.get('Status')
    uploaded_by = request.form.get('upload_by')

    # Derive the file facts from the actual file (authoritative source)
    file_name = uploaded_file.filename
    file_type = file_name.rsplit('.', 1)[-1].upper() if '.' in file_name else ''
    file_bytes = uploaded_file.read()
    file_size_kb = max(1, round(len(file_bytes) / 1024))

    print('Received file:', file_name, '|', file_size_kb, 'KB |', file_type)

    # Frontend sends the group NAME; the table needs document_group_id.
    group_lookup = supabase.table('document_groups') \
        .select('group_id').eq('group_name', group_name).execute()
    if not group_lookup.data:
        return jsonify({'error': f'Document group "{group_name}" not found'}), 400
    group_id = group_lookup.data[0]['group_id']

    supabase.table('documents').insert({
        'title':             title,
        'file_name':         file_name,
        'file_type':         file_type,
        'file_size_kb':      file_size_kb,
        'document_group_id': group_id,
        'version':           version,
        'status':            status,
        'uploaded_by':       uploaded_by,
        # uploaded_date filled automatically by the DB (DEFAULT NOW())
    }).execute()

    return jsonify({
        'response': 'file received',
        'file_name': file_name,
        'size_kb': file_size_kb,
    }), 201
