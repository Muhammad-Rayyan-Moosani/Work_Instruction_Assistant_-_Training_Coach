import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

/* Every possible menu item with the roles allowed to see it */
const ALL_ITEMS = [
  { label: 'Assistant',           path: '/assistant',         roles: ['Administrator', 'Operator', 'Supervisor'] },
  { label: 'Document Search',     path: '/documents/search',  roles: ['Administrator', 'Operator', 'Supervisor'] },
  { label: 'Dashboard',           path: '/dashboard',         roles: ['Administrator', 'Supervisor', 'Executive Viewer'] },
  { label: 'Quiz Builder',        path: '/quiz/builder',      roles: ['Administrator', 'Supervisor'] },
  { label: 'Take Quiz',           path: '/quiz/take',         roles: ['Administrator', 'Operator', 'Supervisor'] },
  { label: 'Quiz Results',        path: '/quiz/results',      roles: ['Administrator', 'Supervisor', 'Executive Viewer'] },
  { label: 'Document Management', path: '/documents/manage',  roles: ['Administrator'] },
  { label: 'User Management',     path: '/users',             roles: ['Administrator'] },
  { label: 'Team Management',     path: '/teams',             roles: ['Administrator'] },
  { label: 'Access Control',      path: '/access-control',    roles: ['Administrator'] },
  { label: 'Settings',            path: '/settings',          roles: ['Administrator'] },
]

function Sidebar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username') || 'User'

  /* Filter the menu by what this role can see */
  const items = ALL_ITEMS.filter(item => item.roles.includes(role))

  function handleLogout() {
    localStorage.clear()
    navigate('/')
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">W</div>
        <span className="sidebar-brand-text">WorkAssist AI</span>
      </div>

      <nav className="sidebar-nav">
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-name">{username}</div>
          <div className="sidebar-user-role">{role}</div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </aside>
  )
}

export default Sidebar
