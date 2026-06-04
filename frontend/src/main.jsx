import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './theme.css'

/* Apply the saved theme immediately so there's no flash of the wrong colours */
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

const domnode = document.getElementById('root');
const root = createRoot(domnode)
root.render(<App />);
