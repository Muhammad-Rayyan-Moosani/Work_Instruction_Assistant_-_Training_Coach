import { useState } from 'react'
import { send_login_data } from '../../api/api.jsx'
import './Login.css'
import { useNavigate } from 'react-router-dom' 

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await send_login_data(username,password);
    console.log('Login attempted:', username);
 
    if (data && data.token){
      const role = localStorage.getItem('role')
      if (role === 'Administrator') navigate('/dashboard')
      else if (role === 'Operator') navigate('/assistant')
      else if (role === 'Supervisor') navigate('/dashboard')
      else if (role === 'Executive Viewer') navigate('/dashboard')

    }
    
        
  }

  function password_set(event){
    return setPassword(event.target.value)
  }

  function username_set(event){
    return setUsername(event.target.value)
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-logo-icon">W</div>
          <span className="login-logo-text">WorkAssist AI</span>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your workspace</p>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              className="login-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={username_set}
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={password_set}
              required
            />
          </div>

          <button className="login-button" type="submit" >
            Sign In
          </button>

        </form>

        <p className="login-footer">
          Access is granted by your system administrator.
        </p>

      </div>
    </div>
  )
}

export default Login
