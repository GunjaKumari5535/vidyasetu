
import { useEffect, useState } from 'react'
import api from './api'
import './NGOManagement.css'

function NGOManagement({ onBack }) {
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    areaOfWork: '',
    contact: ''
  })

  const fetchNgos = async () => {
    try {
      const response = await api.get('/ngo')
      setNgos(response.data)
    } catch (err) {
      setError('Unable to load NGO records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNgos()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const response = await api.post('/ngo/accounts', form)

      setMessage(
        `NGO account created successfully! Login email: ${response.data.email}`
      )

      setForm({
        name: '',
        email: '',
        password: '',
        areaOfWork: '',
        contact: ''
      })

      fetchNgos()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Unable to create NGO account.'
      )
    }
  }

  return (
    <div className="ngo-management-page">
      <div className="ngo-management-header">
        <button onClick={onBack} className="ngo-back-btn">
          ← Back to Dashboard
        </button>

        <h1>NGO Management</h1>
        <p>Create NGO accounts and manage registered organizations.</p>
      </div>

      <div className="ngo-management-content">
        <section className="ngo-form-card">
          <h2>Register New NGO</h2>

          {message && <div className="ngo-success">{message}</div>}
          {error && <div className="ngo-error">{String(error)}</div>}

          <form onSubmit={handleSubmit}>
            <label>NGO Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter NGO name"
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter login email"
              required
            />

            <label>Login Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              minLength="8"
              required
            />

            <label>Area of Work</label>
            <input
              name="areaOfWork"
              value={form.areaOfWork}
              onChange={handleChange}
              placeholder="Example: Rural Education"
              required
            />

            <label>Contact Number</label>
            <input
              type="tel"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />

            <button type="submit" className="ngo-submit-btn">
              Create NGO Account
            </button>
          </form>
        </section>

        <section className="ngo-list-card">
          <h2>Registered NGOs</h2>

          {loading ? (
            <p>Loading NGO records...</p>
          ) : ngos.length === 0 ? (
            <p>No NGOs registered yet.</p>
          ) : (
            <div className="ngo-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NGO Name</th>
                    <th>Area of Work</th>
                    <th>Contact</th>
                  </tr>
                </thead>

                <tbody>
                  {ngos.map((ngo) => (
                    <tr key={ngo.id}>
                      <td>{ngo.id}</td>
                      <td>{ngo.name}</td>
                      <td>{ngo.areaOfWork}</td>
                      <td>{ngo.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default NGOManagement
