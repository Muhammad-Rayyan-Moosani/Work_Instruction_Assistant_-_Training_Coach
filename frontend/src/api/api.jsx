export async function send_login_data(username, password) {
    const login_credentials = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                username: username,
                password: password
            }
        )
    };
     try {
        const response = await fetch('http://127.0.0.1:5000/authentication',login_credentials);
        const data = await response.json()
        console.log('Response:', data)
        if (response.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.role)
            localStorage.setItem('username', username)
        }
        return data                                 

     } catch (error) {
        console.error('Error while logging in: ', error)
     }
}

export async function send_doc_data(title, group, type, size, version, status, date, file, by) {
    /* FormData sends real files (multipart). The file carries its own
       filename, so the backend derives file_name / type / size from it. */
    const formData = new FormData()
    formData.append('file', file)        // the actual file bytes
    formData.append('Title', title)
    formData.append('Group', group)
    formData.append('Version', version)
    formData.append('Status', status)
    formData.append('upload_by', by)

    try {
        const response = await fetch('http://127.0.0.1:5000/documents', {
            method: 'POST',
            /* NOTE: do NOT set Content-Type here. The browser sets it
               automatically with the correct multipart boundary. */
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        })
        const data = await response.json()
        console.log('Response:', data)
        return data

    } catch (error) {
        console.error('error while uploading documents: ', error)
    }
}

