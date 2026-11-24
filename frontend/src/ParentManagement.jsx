
import { useEffect, useState } from 'react'
import api from './api'
import './ParentManagement.css'

function ParentManagement({ onBack }) {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    studentId: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Failed to load students:', error)
      setMessage('Unable to load students.')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!form.studentId) {
      setMessage('Please select a student.')
      return
    }

    setLoading(true)

    try {
      const parentResponse = await api.post('/parent/accounts', {
        name: form.name,
        email: form.email,
        password: form.password
      })

      const parentUserId = parentResponse.data.parentUserId

      await api.post('/parent-links', {
        parentUserId: parentUserId,
        studentId: Number(form.studentId)
      })

      setMessage('Parent account created and student linked successfully!')
      setForm({
        name: '',
        email: '',
        password: '',
        studentId: ''
      })
    } catch (error) {
      console.error('Parent creation failed:', error)
      setMessage(
        error.response?.data?.message ||
        'Unable to create parent account or link student.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="parent-management-page">
      <div className="parent-management-header">
        <button onClick={onBack} className="parent-back-button">
          ← Back to Dashboard
        </button>
        <h1>Parent Management</h1>
        <p>Create a parent account and connect it with a student.</p>
      </div>

      <form className="parent-form" onSubmit={handleSubmit}>
        <h2>Create Parent Account</h2>

        <label>Parent Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter parent name"
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter parent email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
          minLength="8"
          required
        />

        <label>Select Student</label>
        <select
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          required
        >
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} - Class {student.className} - {student.village}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading || students.length === 0}>
          {loading ? 'Creating...' : 'Create Parent & Link Student'}
        </button>

        {message && <p className="parent-message">{message}</p>}
      </form>
    </div>
  )
}

export default ParentManagement
