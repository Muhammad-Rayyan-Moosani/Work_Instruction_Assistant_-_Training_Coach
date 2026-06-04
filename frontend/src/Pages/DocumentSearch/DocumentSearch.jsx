import { useState } from 'react'
import './DocumentSearch.css'

const MOCK_DOCS = [
  { title: 'Torque Spec SOP',         group: 'Line 2 Procedures', type: 'PDF',  version: 'v3', date: '2026-05-22' },
  { title: 'Daily Startup Checklist', group: 'Line 1 Procedures', type: 'PDF',  version: 'v1', date: '2026-04-18' },
  { title: 'Welding PPE Standards',   group: 'Safety',            type: 'DOCX', version: 'v2', date: '2026-03-10' },
  { title: 'Quality Defect Log',      group: 'Quality',           type: 'PDF',  version: 'v1', date: '2026-02-28' },
  { title: 'Lockout / Tagout Guide',  group: 'Safety',            type: 'PDF',  version: 'v4', date: '2026-01-15' },
]

function DocumentSearch() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')

  const filtered = MOCK_DOCS.filter(d => {
    const okQ = d.title.toLowerCase().includes(query.toLowerCase())
    const okG = group === 'all' || d.group === group
    return okQ && okG
  })

  return (
    <div className="ds-page">
      <div className="ds-header">
        <h1 className="ds-title">Document Search</h1>
        <p className="ds-subtitle">Find approved documents you have permission to view.</p>
      </div>

      <div className="ds-controls">
        <input
          className="ds-search"
          type="text"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="ds-select" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="all">All document groups</option>
          <option value="Line 1 Procedures">Line 1 Procedures</option>
          <option value="Line 2 Procedures">Line 2 Procedures</option>
          <option value="Quality">Quality</option>
          <option value="Safety">Safety</option>
        </select>
      </div>

      <div className="ds-card">
        <table className="ds-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Group</th>
              <th>Type</th>
              <th>Version</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={i}>
                <td className="ds-title-cell">{d.title}</td>
                <td>{d.group}</td>
                <td><span className="ds-type">{d.type}</span></td>
                <td>{d.version}</td>
                <td>{d.date}</td>
                <td><button className="ds-open">Open</button></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="ds-empty">No documents match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DocumentSearch
