
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import heroImg from './assets/hero.png'
import api from './api'
import Dashboard from './Dashboard'
import './App.css'

function App() {
  const [role, setRole] = useState('PARENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')

    if (!token) return null

    return {
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role')
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const data = response.data

      if (data.role !== role) {
        setMessage('Please select the correct role for this account.')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('name', data.name)
      localStorage.setItem('email', data.email)
      localStorage.setItem('role', data.role)

      setUser(data)
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Login failed. Check your email and password.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register', {
        name,
        email,
        password
      })

      setMessage('Account created successfully! Please sign in.')
      setIsRegistering(false)
      setRole('STUDENT')
      setName('')
      setPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Registration failed. Please check your details.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    localStorage.removeItem('role')

    setUser(null)
    setEmail('')
    setPassword('')
    setMessage('')
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">V</span>
          <span>VidyaSetu</span>
        </div>

        <span className="nav-tagline">
          Bridging Education, Building Futures
        </span>
      </nav>

      <main className="login-container">
        <section className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">
              EDUCATION • OPPORTUNITY • FUTURE
            </span>

            <h1>
              Every Child Deserves a <span>Brighter Future.</span>
            </h1>

            <p>
              Empowering rural students through education monitoring,
              community support and personalized career guidance.
            </p>

            <div className="hero-image">
              <img src={heroImg} alt="Education and student empowerment" />
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="login-card">
            <span className="welcome">WELCOME TO VIDYASETU</span>

            <h2>
              {isRegistering
                ? 'Create your account'
                : 'Sign in to continue'}
            </h2>

            <p className="subheading">
              {isRegistering
                ? 'Join VidyaSetu and start your learning journey.'
                : 'Access your personalized dashboard.'}
            </p>

            <form onSubmit={isRegistering ? handleRegister : handleLogin}>

              {isRegistering && (
                <>
                  <label>Full Name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </>
              )}

              <label>Email address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {isRegistering && (
                <>
                  <label>Confirm Password</label>

                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                    >
                      {showConfirmPassword
                        ? <EyeOff size={19} />
                        : <Eye size={19} />}
                    </button>
                  </div>
                </>
              )}

              {!isRegistering && (
                <>
                  <label>Select your role</label>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="PARENT">Parent</option>
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="NGO">NGO Volunteer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </>
              )}

              <button type="submit" disabled={loading}>
                {loading
                  ? 'Please wait...'
                  : isRegistering
                    ? 'Create Account →'
                    : 'Sign In →'}
              </button>
            </form>

            {message && (
              <p className="form-message">{message}</p>
            )}

            <p className="account-switch">
              {isRegistering
                ? 'Already have an account? '
                : "Don't have an account? "}

              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setMessage('')
                  setShowPassword(false)
                  setShowConfirmPassword(false)
                }}
              >
                {isRegistering ? 'Sign In' : 'Create Account'}
              </button>
            </p>

            <p className="login-footer">
              Connecting communities. Transforming futures.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
