import { useState } from 'react'
import './UserManagement.css'

/* Teams available to assign — comes from backend later */
const TEAMS = ['Line 1 Crew', 'Line 2 Crew', 'Quality Team']

const MOCK_USERS = [
  { full_name: 'Rayyan Moosani',  username: 'admin',      email: 'rayyan@acme.com', role: 'Administrator',     team: '—',           status: 'Active',   created: '2026-05-20' },
  { full_name: 'Olivia Operator', username: 'operator',   email: 'olivia@acme.com', role: 'Operator',          team: 'Line 1 Crew', status: 'Active',   created: '2026-05-22' },
  { full_name: 'James Operator',  username: 'james',      email: 'james@acme.com',  role: 'Operator',          team: 'Line 2 Crew', status: 'Active',   created: '2026-05-22' },
  { full_name: 'Sam Supervisor',  username: 'supervisor', email: 'sam@acme.com',    role: 'Supervisor',        team: 'Line 1 Crew', status: 'Active',   created: '2026-05-22' },
  { full_name: 'Eva Executive',   username: 'viewer',     email: 'eva@acme.com',    role: 'Executive Viewer',  team: '—',           status: 'Active',   created: '2026-05-22' },
  { full_name: 'Old User',        username: 'olduser',    email: 'old@acme.com',    role: 'Operator',          team: 'Line 2 Crew', status: 'Inactive', created: '2025-12-01' },
]

function UserManagement() {
  const [showForm, setShowForm] = useState(false)
  const [full_name, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Operator')
  const [team, setTeam] = useState('')
  const [password, setPassword] = useState('')

  /* Admins/Executive Viewers see everything, so a team is optional for them */
  const teamRequired = role === 'Operator' || role === 'Supervisor'

  function handleCreate(e) {
    e.preventDefault()
    console.log('Create:', { full_name, username, email, role, team, password })
    setShowForm(false)
    setFullName(''); setUsername(''); setEmail(''); setRole('Operator'); setTeam(''); setPassword('')
  }

  return (
    <div className="um-page">
      <div className="um-header">
        <div>
          <h1 className="um-title">User Management</h1>
          <p className="um-subtitle">Create, edit, and deactivate platform users.</p>
        </div>
        <button className="um-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New User'}
        </button>
      </div>

      {showForm && (
        <div className="um-card">
          <h3 className="um-card-title">Create New User</h3>
          <form className="um-form" onSubmit={handleCreate}>
            <div className="um-row">
              <div className="um-field">
                <label className="um-label">Full Name</label>
                <input className="um-input" value={full_name} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="um-field">
                <label className="um-label">Username</label>
                <input className="um-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>
            <div className="um-row">
              <div className="um-field">
                <label className="um-label">Email</label>
                <input className="um-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="um-field">
                <label className="um-label">Role</label>
                <select className="um-input" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>Administrator</option>
                  <option>Operator</option>
                  <option>Supervisor</option>
                  <option>Executive Viewer</option>
                </select>
              </div>
            </div>
            <div className="um-row">
              <div className="um-field">
                <label className="um-label">
                  Team {teamRequired ? '' : '(optional)'}
                </label>
                <select className="um-input" value={team} onChange={(e) => setTeam(e.target.value)} required={teamRequired}>
                  <option value="">{teamRequired ? 'Select team…' : 'No team (sees all / none)'}</option>
                  {TEAMS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="um-field">
                <label className="um-label">Temporary Password</label>
                <input className="um-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <button className="um-submit" type="submit">Create User</button>
          </form>
        </div>
      )}

      <div className="um-card">
        <table className="um-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Team</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u, i) => (
              <tr key={i}>
                <td className="um-name">{u.full_name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td><span className="um-role">{u.role}</span></td>
                <td>{u.team}</td>
                <td><span className={'um-status ' + (u.status === 'Active' ? 'um-status-active' : 'um-status-inactive')}>{u.status}</span></td>
                <td>{u.created}</td>
                <td><button className="um-link">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
