import Sidebar from './Sidebar.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import './Layout.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-body">
        <header className="layout-topbar">
          <ThemeToggle />
        </header>
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
