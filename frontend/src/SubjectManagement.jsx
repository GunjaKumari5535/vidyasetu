
import { useEffect, useState } from 'react'
import api from './api'
import './SubjectManagement.css'

function SubjectManagement({ onBack }) {
  const [subjects, setSubjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects')
      setSubjects(response.data)
    } catch (err) {
      setError('Unable to load subjects. Please check your login.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!name.trim()) {
      setError('Please enter a subject name.')
      return
    }

    try {
      setSaving(true)

      const response = await api.post('/subjects', {
        name: name.trim(),
        description: description.trim()
      })

      setSubjects((previous) => [...previous, response.data])
      setName('')
      setDescription('')
      setMessage('Subject added successfully!')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to add subject. It may already exist.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="subject-management">
      <button className="subject-back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="subject-heading">
        <h2>Subject Management</h2>
        <p>Add and manage academic subjects for student examinations.</p>
      </div>

      <div className="subject-card">
        <h3>Add New Subject</h3>

        <form onSubmit={handleSubmit}>
          <div className="subject-field">
            <label>Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mathematics"
              required
            />
          </div>

          <div className="subject-field">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short subject description"
              rows="3"
            />
          </div>

          {error && <p className="subject-error">{error}</p>}
          {message && <p className="subject-success">{message}</p>}

          <button
            type="submit"
            className="subject-submit-btn"
            disabled={saving}
          >
            {saving ? 'Adding...' : 'Add Subject'}
          </button>
        </form>
      </div>

      <div className="subject-card subject-list-card">
        <div className="subject-list-heading">
          <h3>Available Subjects</h3>
          <span>{subjects.length} Subjects</span>
        </div>

        {loading ? (
          <p>Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="subject-empty">
            No subjects added yet. Add your first subject above.
          </p>
        ) : (
          <div className="subject-list">
            {subjects.map((subject) => (
              <div className="subject-item" key={subject.id}>
                <div className="subject-item-icon">📘</div>
                <div className="subject-item-info">
                  <h4>{subject.name}</h4>
                  <p>{subject.description || 'No description provided'}</p>
                </div>
                <span className="subject-item-id">
                  ID: {subject.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubjectManagement
