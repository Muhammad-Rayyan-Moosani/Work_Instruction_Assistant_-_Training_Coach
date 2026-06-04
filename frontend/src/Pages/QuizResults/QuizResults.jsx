import { useState } from 'react'
import './QuizResults.css'

const MOCK_RESULTS = [
  { quiz: 'Torque Spec Check',     user: 'Olivia Operator', correct: 4, total: 5, score: 80,  completed: '2026-05-22 11:45' },
  { quiz: 'Torque Spec Check',     user: 'James Operator',  correct: 5, total: 5, score: 100, completed: '2026-05-22 13:10' },
  { quiz: 'Daily Startup Quiz',    user: 'Olivia Operator', correct: 3, total: 5, score: 60,  completed: '2026-05-23 08:22' },
  { quiz: 'Welding PPE Standards', user: 'James Operator',  correct: 4, total: 4, score: 100, completed: '2026-05-23 09:48' },
  { quiz: 'Daily Startup Quiz',    user: 'Maria Operator',  correct: 2, total: 5, score: 40,  completed: '2026-05-24 07:15' },
]

function QuizResults() {
  const [quizFilter, setQuizFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('')

  const filtered = MOCK_RESULTS.filter(r => {
    const okQ = quizFilter === 'all' || r.quiz === quizFilter
    const okU = !userFilter || r.user.toLowerCase().includes(userFilter.toLowerCase())
    return okQ && okU
  })

  const avgScore = filtered.length
    ? Math.round(filtered.reduce((s, r) => s + r.score, 0) / filtered.length)
    : 0

  function scoreClass(s) {
    if (s >= 80) return 'qr-score-green'
    if (s >= 60) return 'qr-score-amber'
    return 'qr-score-red'
  }

  return (
    <div className="qr-page">
      <div className="qr-header">
        <div>
          <h1 className="qr-title">Quiz Results</h1>
          <p className="qr-subtitle">Track who has completed quizzes and how they scored.</p>
        </div>
        <button className="qr-export">Export CSV</button>
      </div>

      <div className="qr-kpis">
        <div className="qr-kpi">
          <div className="qr-kpi-label">Total Attempts</div>
          <div className="qr-kpi-value">{filtered.length}</div>
        </div>
        <div className="qr-kpi">
          <div className="qr-kpi-label">Average Score</div>
          <div className="qr-kpi-value">{avgScore}%</div>
        </div>
        <div className="qr-kpi">
          <div className="qr-kpi-label">Pass Rate (≥70%)</div>
          <div className="qr-kpi-value">
            {filtered.length ? Math.round((filtered.filter(r => r.score >= 70).length / filtered.length) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="qr-filters">
        <select className="qr-select" value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
          <option value="all">All quizzes</option>
          <option>Torque Spec Check</option>
          <option>Daily Startup Quiz</option>
          <option>Welding PPE Standards</option>
        </select>
        <input className="qr-search" placeholder="Search by user…" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
      </div>

      <div className="qr-card">
        <table className="qr-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>User</th>
              <th>Correct</th>
              <th>Total</th>
              <th>Score</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td className="qr-quiz-name">{r.quiz}</td>
                <td>{r.user}</td>
                <td>{r.correct}</td>
                <td>{r.total}</td>
                <td><span className={'qr-score ' + scoreClass(r.score)}>{r.score}%</span></td>
                <td>{r.completed}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="qr-empty">No results.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default QuizResults
