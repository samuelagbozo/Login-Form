import { useState } from 'react'
import './App.css'
import LightMode from './light-mode'
import LoginScrollExperience from './LoginScrollExperience'

function App() {
  const [isLight, setIsLight] = useState(false)
  const theme = isLight ? 'light' : 'dark'

  return (
    <div className="login-app" data-theme={theme}>
      <LightMode isLight={isLight} onToggle={() => setIsLight((current) => !current)} />
      <LoginScrollExperience theme={theme} />
    </div>
  )
}

export default App
