import { useState } from 'react'
import './AdminSettings.css'

function AdminSettings() {
  const [confidence, setConfidence] = useState(70)
  const [maxUpload, setMaxUpload] = useState(25)
  const [sessionTimeout, setSessionTimeout] = useState(60)
  const [defaultGroup, setDefaultGroup] = useState('')

  function handleSave(e) {
    e.preventDefault()
    console.log('Saved:', { confidence, maxUpload, sessionTimeout, defaultGroup })
  }

  return (
    <div className="set-page">
      <div className="set-header">
        <h1 className="set-title">Settings</h1>
        <p className="set-subtitle">Platform-wide configuration.</p>
      </div>

      <form className="set-card" onSubmit={handleSave}>

        <div className="set-section">
          <div className="set-section-head">
            <h3 className="set-section-title">AI Confidence Threshold</h3>
            <p className="set-section-sub">Answers below this score are flagged as low confidence.</p>
          </div>
          <div className="set-control">
            <input
              type="range" min="0" max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="set-slider"
            />
            <span className="set-value">{confidence}%</span>
          </div>
        </div>

        <div className="set-section">
          <div className="set-section-head">
            <h3 className="set-section-title">Maximum Upload Size</h3>
            <p className="set-section-sub">Per-file upload limit in megabytes.</p>
          </div>
          <div className="set-control">
            <input
              type="number" min="1" max="500"
              value={maxUpload}
              onChange={(e) => setMaxUpload(Number(e.target.value))}
              className="set-input"
            />
            <span className="set-value-static">MB</span>
          </div>
        </div>

        <div className="set-section">
          <div className="set-section-head">
            <h3 className="set-section-title">Session Timeout</h3>
            <p className="set-section-sub">Minutes of inactivity before logout.</p>
          </div>
          <div className="set-control">
            <input
              type="number" min="5" max="480"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="set-input"
            />
            <span className="set-value-static">min</span>
          </div>
        </div>

        <div className="set-section">
          <div className="set-section-head">
            <h3 className="set-section-title">Default Document Group</h3>
            <p className="set-section-sub">Pre-selected group when uploading new documents.</p>
          </div>
          <div className="set-control">
            <select className="set-select" value={defaultGroup} onChange={(e) => setDefaultGroup(e.target.value)}>
              <option value="">None</option>
              <option>Line 1 Procedures</option>
              <option>Line 2 Procedures</option>
              <option>Quality</option>
              <option>Safety</option>
            </select>
          </div>
        </div>

        <div className="set-actions">
          <button type="button" className="set-reset">Reset to defaults</button>
          <button type="submit" className="set-save">Save Changes</button>
        </div>

      </form>
    </div>
  )
}

export default AdminSettings
