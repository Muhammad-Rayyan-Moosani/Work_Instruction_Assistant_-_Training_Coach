import { useState } from 'react'
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import './UsageDashboard.css'

/* ───── MOCK DATA — replace with backend fetch later ───── */

const mockKpi = {
  total: 1284,
  answered: 87,
  lowConfidence: 9,
  noAnswer: 4,
}

const mockTimeSeries = [
  { day: 'Mon', questions: 142 },
  { day: 'Tue', questions: 168 },
  { day: 'Wed', questions: 195 },
  { day: 'Thu', questions: 211 },
  { day: 'Fri', questions: 186 },
  { day: 'Sat', questions: 92 },
  { day: 'Sun', questions: 75 },
]

const mockByGroup = [
  { group: 'Line 1', questions: 312 },
  { group: 'Line 2', questions: 421 },
  { group: 'Quality', questions: 198 },
  { group: 'Safety', questions: 153 },
  { group: 'Maintenance', questions: 200 },
]

const mockTopQuestions = [
  { q: 'What torque spec for the X bracket?',     count: 42, conf: 94 },
  { q: 'How to calibrate Line 2 sensor?',         count: 38, conf: 91 },
  { q: 'PPE required in welding zone?',           count: 29, conf: 96 },
  { q: 'Daily startup checklist for Line 1?',     count: 24, conf: 89 },
  { q: 'How to log a quality defect?',            count: 21, conf: 93 },
]

const mockGaps = [
  { q: 'How to reset error code E-47?',           count: 18, conf: 41 },
  { q: 'Lockout procedure for new press?',        count: 14, conf: 38 },
  { q: 'Where to find updated SOP for X-200?',    count: 11, conf: 33 },
]

/* ───── Component ───── */

function UsageDashboard() {
  const [dateRange, setDateRange] = useState('30d')
  const [group, setGroup] = useState('all')

  return (
    <div className="dash-page">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Usage Dashboard</h1>
          <p className="dash-subtitle">Question activity, accuracy, and gaps in your approved documentation.</p>
        </div>
        <button className="dash-export">Export CSV</button>
      </div>

      {/* Filters */}
      <div className="dash-filters">
        <select className="dash-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>

        <select className="dash-select" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="all">All document groups</option>
          <option value="line1">Line 1</option>
          <option value="line2">Line 2</option>
          <option value="quality">Quality</option>
          <option value="safety">Safety</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="dash-kpis">
        <div className="dash-kpi">
          <div className="dash-kpi-label">Total Questions</div>
          <div className="dash-kpi-value">{mockKpi.total.toLocaleString()}</div>
        </div>
        <div className="dash-kpi dash-kpi-green">
          <div className="dash-kpi-label">Answered</div>
          <div className="dash-kpi-value">{mockKpi.answered}%</div>
        </div>
        <div className="dash-kpi dash-kpi-amber">
          <div className="dash-kpi-label">Low Confidence</div>
          <div className="dash-kpi-value">{mockKpi.lowConfidence}%</div>
        </div>
        <div className="dash-kpi dash-kpi-red">
          <div className="dash-kpi-label">No Answer</div>
          <div className="dash-kpi-value">{mockKpi.noAnswer}%</div>
        </div>
      </div>

      {/* Charts */}
      <div className="dash-charts">

        <div className="dash-card">
          <h3 className="dash-card-title">Questions Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mockTimeSeries}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="questions" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">Questions by Document Group</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockByGroup}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="group" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="questions" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Tables */}
      <div className="dash-card">
        <h3 className="dash-card-title">Most Asked Questions</h3>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Count</th>
              <th>Avg. Confidence</th>
            </tr>
          </thead>
          <tbody>
            {mockTopQuestions.map((row, i) => (
              <tr key={i}>
                <td>{row.q}</td>
                <td>{row.count}</td>
                <td><span className="dash-badge dash-badge-green">{row.conf}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dash-card">
        <h3 className="dash-card-title">Documentation Gaps — Low Confidence</h3>
        <p className="dash-card-sub">Questions the assistant struggled to answer. Strong signal that documentation is missing or unclear.</p>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Count</th>
              <th>Avg. Confidence</th>
            </tr>
          </thead>
          <tbody>
            {mockGaps.map((row, i) => (
              <tr key={i}>
                <td>{row.q}</td>
                <td>{row.count}</td>
                <td><span className="dash-badge dash-badge-amber">{row.conf}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default UsageDashboard
