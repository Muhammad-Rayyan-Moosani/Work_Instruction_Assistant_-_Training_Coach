import { useState } from 'react'
import './TakeQuiz.css'

const MOCK_QUIZZES = [
  { id: 1, title: 'Torque Spec Check',      doc: 'Torque Spec SOP',          questions: 3 },
  { id: 2, title: 'Daily Startup Quiz',     doc: 'Daily Startup Checklist',  questions: 5 },
  { id: 3, title: 'Welding PPE Standards',  doc: 'Welding PPE Standards',    questions: 4 },
]

const MOCK_QUESTIONS = [
  { q: 'What is the correct torque value for the X-200 bracket bolts?', options: ['18 Nm', '24 Nm', '30 Nm', '36 Nm'], correct: 1 },
  { q: 'In what pattern should the bolts be tightened?', options: ['Sequential', 'Star pattern', 'Random', 'Top-to-bottom'], correct: 1 },
  { q: 'How many bolts secure the X-200 bracket?', options: ['2', '3', '4', '6'], correct: 2 },
]

function TakeQuiz() {
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function startQuiz(id) {
    setSelected(id)
    setAnswers({})
    setSubmitted(false)
  }

  function selectAnswer(qi, oi) {
    if (submitted) return
    setAnswers({ ...answers, [qi]: oi })
  }

  function submit() {
    setSubmitted(true)
  }

  const score = Object.entries(answers).filter(
    ([qi, oi]) => MOCK_QUESTIONS[qi].correct === oi
  ).length
  const total = MOCK_QUESTIONS.length

  if (!selected) {
    return (
      <div className="tq-page">
        <div className="tq-header">
          <h1 className="tq-title">Take a Quiz</h1>
          <p className="tq-subtitle">Pick a quiz to test your knowledge.</p>
        </div>

        <div className="tq-quiz-list">
          {MOCK_QUIZZES.map(qz => (
            <div key={qz.id} className="tq-quiz-card" onClick={() => startQuiz(qz.id)}>
              <div className="tq-quiz-meta">{qz.questions} questions</div>
              <div className="tq-quiz-title">{qz.title}</div>
              <div className="tq-quiz-doc">Based on: {qz.doc}</div>
              <button className="tq-start-btn">Start →</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="tq-page">
      <div className="tq-header">
        <button className="tq-back" onClick={() => setSelected(null)}>← Back to quizzes</button>
        <h1 className="tq-title">{MOCK_QUIZZES.find(q => q.id === selected).title}</h1>
      </div>

      {submitted && (
        <div className="tq-score-card">
          <div className="tq-score-label">Your Score</div>
          <div className="tq-score-value">{score} / {total}</div>
          <div className="tq-score-pct">{Math.round((score / total) * 100)}%</div>
        </div>
      )}

      {MOCK_QUESTIONS.map((q, qi) => (
        <div key={qi} className="tq-q-card">
          <div className="tq-q-head"><span className="tq-q-num">Q{qi + 1}</span> {q.q}</div>
          <div className="tq-options">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi
              const isCorrect = submitted && oi === q.correct
              const isWrong = submitted && isSelected && oi !== q.correct
              let cls = 'tq-option'
              if (isSelected && !submitted) cls += ' tq-option-selected'
              if (isCorrect) cls += ' tq-option-correct'
              if (isWrong) cls += ' tq-option-wrong'
              return (
                <div key={oi} className={cls} onClick={() => selectAnswer(qi, oi)}>
                  <span className="tq-option-letter">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button className="tq-submit" onClick={submit} disabled={Object.keys(answers).length < total}>
          Submit Quiz
        </button>
      )}
    </div>
  )
}

export default TakeQuiz
