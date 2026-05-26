import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchHealthCheck()
  }, [])

  const fetchHealthCheck = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/health`)
      const data = await response.json()
      setMessage(data.message)
      setError(null)
    } catch (err) {
      setError('Failed to connect to backend')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vite + React + Flask</h1>
        <div className="status-card">
          {loading && <p>Connecting to backend...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <div>
              <p className="success">Backend Status: {message}</p>
              <button onClick={fetchHealthCheck}>
                Refresh Connection
              </button>
            </div>
          )}
        </div>
        <div className="info">
          <p>Edit <code>src/App.jsx</code> to get started</p>
          <p>Backend running on: {API_URL}</p>
        </div>
      </header>
    </div>
  )
}

export default App
