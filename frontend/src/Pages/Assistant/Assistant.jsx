import { useState } from 'react'
import './Assistant.css'

function Assistant() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState([
    {
      q: 'What is the correct torque for the X-200 bracket bolts?',
      a: 'According to the Torque Spec SOP (v3), the X-200 bracket bolts require 24 Nm of torque, applied in a star pattern across all four bolts.',
      confidence: 94,
      source: 'Torque Spec SOP v3, page 2',
      group: 'Line 2 Procedures',
    },
  ])

  function handleAsk(e) {
    e.preventDefault()
    if (!question.trim()) return

    // MOCK — replace with backend call
    const mockAnswer = {
      q: question,
      a: 'This is a placeholder answer. The backend will return a real answer grounded in your approved documents.',
      confidence: 88,
      source: 'Mock Document v1, page 1',
      group: 'Line 2 Procedures',
    }
    setHistory([mockAnswer, ...history])
    setQuestion('')
  }

  function confidenceClass(score) {
    if (score >= 80) return 'asst-badge-green'
    if (score >= 60) return 'asst-badge-amber'
    return 'asst-badge-red'
  }

  return (
    <div className="asst-page">
      <div className="asst-header">
        <h1 className="asst-title">Ask the Assistant</h1>
        <p className="asst-subtitle">Plain-English answers, sourced only from approved documents.</p>
      </div>

      <form className="asst-input-card" onSubmit={handleAsk}>
        <input
          className="asst-input"
          type="text"
          placeholder="e.g. What is the torque spec for the X-200 bracket?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="asst-button" type="submit">Ask</button>
      </form>

      <div className="asst-history">
        <h3 className="asst-history-title">Recent Questions</h3>
        {history.map((item, i) => (
          <div key={i} className="asst-answer-card">
            <div className="asst-q">
              <span className="asst-q-label">Q:</span> {item.q}
            </div>
            <div className="asst-a">{item.a}</div>
            <div className="asst-meta">
              <span className={'asst-badge ' + confidenceClass(item.confidence)}>
                {item.confidence}% confidence
              </span>
              <span className="asst-source">
                📄 {item.source} <span className="asst-group">— {item.group}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Assistant
