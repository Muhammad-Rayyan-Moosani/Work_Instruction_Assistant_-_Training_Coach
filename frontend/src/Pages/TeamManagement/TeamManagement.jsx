import { useState } from 'react'
import './TeamManagement.css'

/* Teams that exist — from backend later */
const TEAMS = [
  { id: 1, name: 'Line 1 Crew' },
  { id: 2, name: 'Line 2 Crew' },
  { id: 3, name: 'Quality Team' },
]

/* Users with their HOME team (teamId). null = no team (admins / exec viewers) */
const INITIAL_USERS = [
  { id: 1, name: 'Olivia Operator', role: 'Operator',         teamId: 1 },
  { id: 2, name: 'James Operator',  role: 'Operator',         teamId: 2 },
  { id: 3, name: 'Maria Operator',  role: 'Operator',         teamId: 1 },
  { id: 4, name: 'Sam Supervisor',  role: 'Supervisor',       teamId: 1 },
  { id: 5, name: 'Dana Supervisor', role: 'Supervisor',       teamId: 2 },
  { id: 6, name: 'Eva Executive',   role: 'Executive Viewer', teamId: null },
]

/* Extra teams a supervisor can ALSO view (beyond their home team).
   Shape: { supervisorId: { teamId: true } } */
const INITIAL_EXTRA = {
  4: { 2: false, 3: false },   // Sam (home Line 1) — no extra yet
  5: { 1: false, 3: true  },   // Dana (home Line 2) — also granted Quality
}

function TeamManagement() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [extra, setExtra] = useState(INITIAL_EXTRA)

  /* change a user's home team */
  function setUserTeam(userId, teamId) {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, teamId: teamId === '' ? null : Number(teamId) } : u
    ))
  }

  /* toggle a supervisor's extra access to another team */
  function toggleExtra(supId, teamId) {
    setExtra({
      ...extra,
      [supId]: { ...extra[supId], [teamId]: !extra[supId]?.[teamId] },
    })
  }

  const supervisors = users.filter(u => u.role === 'Supervisor')

  function teamName(id) {
    const t = TEAMS.find(t => t.id === id)
    return t ? t.name : '—'
  }

  return (
    <div className="tm-page">
      <div className="tm-header">
        <h1 className="tm-title">Team Management</h1>
        <p className="tm-subtitle">Assign users to teams and grant supervisors access across teams.</p>
      </div>

      {/* ── Card 1: team membership ── */}
      <div className="tm-card">
        <h3 className="tm-card-title">Team Membership</h3>
        <p className="tm-card-sub">Each operator and supervisor belongs to one home team that decides which documents they see.</p>
        <table className="tm-table">
          <thead>
            <tr><th>Name</th><th>Role</th><th>Home Team</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="tm-name">{u.name}</td>
                <td><span className="tm-role">{u.role}</span></td>
                <td>
                  {u.role === 'Administrator' || u.role === 'Executive Viewer' ? (
                    <span className="tm-na">Not team-based</span>
                  ) : (
                    <select
                      className="tm-select"
                      value={u.teamId ?? ''}
                      onChange={(e) => setUserTeam(u.id, e.target.value)}
                    >
                      <option value="">No team</option>
                      {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Card 2: supervisor cross-team access ── */}
      <div className="tm-card">
        <h3 className="tm-card-title">Supervisor Cross-Team Access</h3>
        <p className="tm-card-sub">A supervisor sees their home team by default. Tick other teams to let them view those documents too.</p>

        {supervisors.map(sup => (
          <div key={sup.id} className="tm-sup">
            <div className="tm-sup-head">
              <span className="tm-sup-name">{sup.name}</span>
              <span className="tm-sup-home">Home: {teamName(sup.teamId)}</span>
            </div>
            <div className="tm-sup-teams">
              {TEAMS.filter(t => t.id !== sup.teamId).map(t => (
                <label key={t.id} className="tm-chip">
                  <input
                    type="checkbox"
                    checked={extra[sup.id]?.[t.id] || false}
                    onChange={() => toggleExtra(sup.id, t.id)}
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamManagement
