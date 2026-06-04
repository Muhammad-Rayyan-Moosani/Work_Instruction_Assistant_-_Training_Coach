import { useState } from 'react'
import './QuizBuilder.css'

const MOCK_QUESTIONS = [
  {
    q: 'What is the correct torque value for the X-200 bracket bolts?',
    options: ['18 Nm', '24 Nm', '30 Nm', '36 Nm'],
    correct: 1,
    source: 'Torque Spec SOP, p.2',
  },
  {
    q: 'In what pattern should the X-200 bracket bolts be tightened?',
    options: ['Sequential', 'Star pattern', 'Random', 'Top-to-bottom'],
    correct: 1,
    source: 'Torque Spec SOP, p.3',
  },
  {
    q: 'How many bolts secure the X-200 bracket?',
    options: ['2', '3', '4', '6'],
    correct: 2,
    source: 'Torque Spec SOP, p.2',
  },
]

function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState('Torque Spec Check')
  const [document, setDocument] = useState('Torque Spec SOP')
  const [questions, setQuestions] = useState(MOCK_QUESTIONS)
  const [generated, setGenerated] = useState(true)

  function generate() {
    setQuestions(MOCK_QUESTIONS)
    setGenerated(true)
  }

  function removeQuestion(idx) {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  return (
    <div className="qb-page">
      <div className="qb-header">
        <div>
          <h1 className="qb-title">Quiz Builder</h1>
          <p className="qb-subtitle">Generate multiple-choice quizzes from approved documents.</p>
        </div>
        <button className="qb-publish" disabled={!generated}>Publish Quiz</button>
      </div>

      <div className="qb-card">
        <div className="qb-form">
          <div className="qb-field">
            <label className="qb-label">Quiz Title</label>
            <input className="qb-input" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} />
          </div>
          <div className="qb-field">
            <label className="qb-label">Source Document</label>
            <select className="qb-input" value={document} onChange={(e) => setDocument(e.target.value)}>
              <option>Torque Spec SOP</option>
              <option>Daily Startup Checklist</option>
              <option>Welding PPE Standards</option>
            </select>
          </div>
          <button className="qb-generate" onClick={generate}>Generate Questions</button>
        </div>
      </div>

      {generated && (
        <div className="qb-questions">
          <h3 className="qb-section-title">Generated Questions ({questions.length})</h3>
          {questions.map((q, i) => (
            <div key={i} className="qb-card qb-q">
              <div className="qb-q-head">
                <span className="qb-q-num">Q{i + 1}</span>
                <span className="qb-q-text">{q.q}</span>
                <button className="qb-remove" onClick={() => removeQuestion(i)}>Remove</button>
              </div>
              <div className="qb-options">
                {q.options.map((opt, oi) => (
                  <div key={oi} className={'qb-option ' + (oi === q.correct ? 'qb-option-correct' : '')}>
                    <span className="qb-option-letter">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                    {oi === q.correct && <span className="qb-correct-tag">Correct</span>}
                  </div>
                ))}
              </div>
              <div className="qb-source">📄 {q.source}</div>
            </div>
          ))}
          <button className="qb-regen" onClick={generate}>↻ Regenerate All</button>
        </div>
      )}
    </div>
  )
}

export default QuizBuilder
