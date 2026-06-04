import { useState } from 'react'
import './AccessControl.css'

/* All document groups that exist in the system */
const ALL_GROUPS = ['Line 1 Procedures', 'Line 2 Procedures', 'Quality', 'Safety']

/* Teams, each with the document groups they're allowed to view.
   Replace with backend data later. */
const INITIAL_TEAMS = [
  {
    id: 1,
    name: 'Line 1 Crew',
    description: 'Operators and supervisors on Line 1',
    groups: { 'Line 1 Procedures': true, 'Line 2 Procedures': false, Quality: false, Safety: true },
  },
  {
    id: 2,
    name: 'Line 2 Crew',
    description: 'Operators and supervisors on Line 2',
    groups: { 'Line 1 Procedures': false, 'Line 2 Procedures': true, Quality: false, Safety: true },
  },
  {
    id: 3,
    name: 'Quality Team',
    description: 'Quality inspectors',
    groups: { 'Line 1 Procedures': false, 'Line 2 Procedures': false, Quality: true, Safety: true },
  },
]

function AccessControl() {
  const [teams, setTeams] = useState(INITIAL_TEAMS)
  const [selected, setSelected] = useState(INITIAL_TEAMS[0].id)
  const [newTeam, setNewTeam] = useState('')

  const current = teams.find(t => t.id === selected)

  function toggleGroup(group) {
    setTeams(teams.map(t => t.id === selected
      ? { ...t, groups: { ...t.groups, [group]: !t.groups[group] } }
      : t
    ))
  }

  function addTeam(e) {
    e.preventDefault()
    if (!newTeam.trim()) return
    const id = teams.length ? Math.max(...teams.map(t => t.id)) + 1 : 1
    const emptyGroups = Object.fromEntries(ALL_GROUPS.map(g => [g, false]))
    setTeams([...teams, { id, name: newTeam, description: '', groups: emptyGroups }])
    setNewTeam('')
    setSelected(id)
  }

  return (
    <div className="ac-page">
      <div className="ac-header">
        <h1 className="ac-title">Access Control</h1>
        <p className="ac-subtitle">Create teams and decide which document groups each team can see. Administrators always see everything.</p>
      </div>

      <div className="ac-layout">
        <div className="ac-card ac-groups">
          <h3 className="ac-card-title">Teams</h3>
          <form className="ac-add-form" onSubmit={addTeam}>
            <input className="ac-input" placeholder="New team name…" value={newTeam} onChange={(e) => setNewTeam(e.target.value)} />
            <button className="ac-add-btn" type="submit">Add</button>
          </form>
          <ul className="ac-list">
            {teams.map(t => (
              <li
                key={t.id}
                className={'ac-list-item' + (t.id === selected ? ' ac-list-item-active' : '')}
                onClick={() => setSelected(t.id)}
              >
                {t.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="ac-card ac-perms">
          <h3 className="ac-card-title">{current?.name}</h3>
          <p className="ac-card-sub">{current?.description || 'No description'}</p>
          <div className="ac-perms-label">Document groups this team can view</div>
          <div className="ac-roles">
            {ALL_GROUPS.map(group => (
              <label key={group} className="ac-role-row">
                <span>{group}</span>
                <input
                  type="checkbox"
                  checked={current?.groups[group] || false}
                  onChange={() => toggleGroup(group)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessControl
