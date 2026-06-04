import { useState } from 'react'
import { send_doc_data } from '../../api/api.jsx'
import './DocumentManagement.css'

const MOCK_DOCS = [
  { title: 'Torque Spec SOP',         group: 'Line 2 Procedures', type: 'PDF',  size: 842,  version: 'v3', status: 'Active',   by: 'admin', date: '2026-05-22' },
  { title: 'Daily Startup Checklist', group: 'Line 1 Procedures', type: 'PDF',  size: 412,  version: 'v1', status: 'Active',   by: 'admin', date: '2026-04-18' },
  { title: 'Welding PPE Standards',   group: 'Safety',            type: 'DOCX', size: 198,  version: 'v2', status: 'Active',   by: 'admin', date: '2026-03-10' },
  { title: 'Old Torque SOP',          group: 'Line 2 Procedures', type: 'PDF',  size: 798,  version: 'v2', status: 'Archived', by: 'admin', date: '2026-01-08' },
]

function DocumentManagement() {
  const [docs, setDocs] = useState(MOCK_DOCS)
  const [title, setTitle] = useState('')
  const [group, setGroup] = useState('')
  const [version, setVersion] = useState('')
  const [file, setFile] = useState(null)

  function handleUpload(e) {
    e.preventDefault()
    if (!file) return

    /* Everything except text-extraction can be derived here in the browser */
    const type = file.name.split('.').pop().toUpperCase()   // PDF / DOCX / TXT
    const sizeKB = Math.max(1, Math.round(file.size / 1024)) // bytes → KB
    const uploadedBy = localStorage.getItem('username') || 'admin'
    const today = new Date().toISOString().slice(0, 10)      // YYYY-MM-DD

    const newDoc = {
      title,
      group,
      type,
      size: sizeKB,
      version: version || '—',
      status: 'Active',
      by: uploadedBy,
      date: today,
    }

    /* Optimistically add the row to the table */
    setDocs([newDoc, ...docs])

    /* Ship the file to the backend (text extraction / storage) */
    send_doc_data(title,group,type,sizeKB,version,'Active',today,file,uploadedBy)

    /* Clear the form */
    setTitle(''); setGroup(''); setVersion(''); setFile(null)
  }

  return (
    <div className="dm-page">
      <div className="dm-header">
        <h1 className="dm-title">Document Management</h1>
        <p className="dm-subtitle">Upload approved documents and organise them into groups.</p>
      </div>

      <div className="dm-card">
        <h3 className="dm-card-title">Upload New Document</h3>
        <form className="dm-form" onSubmit={handleUpload}>
          <div className="dm-row">
            <div className="dm-field">
              <label className="dm-label">Title</label>
              <input className="dm-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Torque Spec SOP" required />
            </div>
            <div className="dm-field">
              <label className="dm-label">Document Group</label>
              <select className="dm-input" value={group} onChange={(e) => setGroup(e.target.value)} required>
                <option value="">Select group…</option>
                <option>Line 1 Procedures</option>
                <option>Line 2 Procedures</option>
                <option>Quality</option>
                <option>Safety</option>
              </select>
            </div>
            <div className="dm-field">
              <label className="dm-label">Version (optional)</label>
              <input className="dm-input" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v1" />
            </div>
          </div>
          <div className="dm-file-row">
            <label className="dm-file">
              <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} hidden />
              <span className="dm-file-button">Choose File</span>
              <span className="dm-file-name">{file ? file.name : 'PDF, DOCX or TXT'}</span>
            </label>
            <button className="dm-upload" type="submit">Upload</button>
          </div>
        </form>
      </div>

      <div className="dm-card">
        <h3 className="dm-card-title">All Documents</h3>
        <table className="dm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Group</th>
              <th>Type</th>
              <th>Size</th>
              <th>Version</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i}>
                <td>{d.title}</td>
                <td>{d.group}</td>
                <td><span className="dm-type">{d.type}</span></td>
                <td>{d.size} KB</td>
                <td>{d.version}</td>
                <td><span className={'dm-status ' + (d.status === 'Active' ? 'dm-status-active' : 'dm-status-archived')}>{d.status}</span></td>
                <td>{d.date}</td>
                <td>
                  <button className="dm-link">Archive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DocumentManagement
