
import { useEffect, useState } from 'react'
import api from './api'
import './StudentManagement.css'

function StudentManagement({ onBack }) {
  const emptyForm = {
    name: '',
    className: '',
    village: '',
    parentPhone: ''
  }

  const [students, setStudents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/students')
      setStudents(response.data)
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'You do not have permission to view students.'
          : 'Unable to load students. Please check your connection and login.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!form.name.trim() || !form.className || !form.village.trim()) {
      setError('Please fill in student name, class and village.')
      return
    }

    if (form.parentPhone && !/^[0-9]{10}$/.test(form.parentPhone)) {
      setError('Please enter a valid 10-digit parent phone number.')
      return
    }

    try {
      setSaving(true)

      const studentData = {
        name: form.name.trim(),
        className: form.className,
        village: form.village.trim(),
        parentPhone: form.parentPhone.trim()
      }

      if (editingId) {
        await api.put(`/students/${editingId}`, studentData)
        setMessage('Student details updated successfully.')
      } else {
        await api.post('/students', studentData)
        setMessage('Student added successfully.')
      }

      setForm(emptyForm)
      setEditingId(null)
      await fetchStudents()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to save student details. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (student) => {
    setForm({
      name: student.name || '',
      className: student.className || '',
      village: student.village || '',
      parentPhone: student.parentPhone || ''
    })

    setEditingId(student.id)
    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setMessage('')
  }

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    try {
      await api.delete(`/students/${student.id}`)
      setMessage('Student deleted successfully.')
      if (editingId === student.id) cancelEdit()
      await fetchStudents()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to delete this student. Their record may be linked to other academic data.'
      )
    }
  }

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase()

    return (
      student.name?.toLowerCase().includes(searchText) ||
      student.className?.toLowerCase().includes(searchText) ||
      student.village?.toLowerCase().includes(searchText)
    )
  })

  return (
    <main className="student-management">
      <div className="student-page-heading">
        <div>
          <button className="back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <span className="student-eyebrow">TEACHER WORKSPACE</span>
          <h1>Student Management</h1>
          <p>Add, view and manage student academic records.</p>
        </div>

        <div className="student-total">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>
      </div>

      <section className="student-form-card">
        <div className="student-card-heading">
          <div>
            <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
            <p>
              {editingId
                ? 'Update the student information below.'
                : 'Enter the details to register a student.'}
            </p>
          </div>
          <span className="student-form-icon">
            {editingId ? '✏️' : '👨‍🎓'}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="student-form-grid">
            <label>
              Student Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </label>

            <label>
              Class *
              <select
                name="className"
                value={form.className}
                onChange={handleChange}
                required
              >
                <option value="">Select class</option>
                {['6', '7', '8', '9', '10', '11', '12'].map((value) => (
                  <option key={value} value={value}>
                    Class {value}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Village *
              <input
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="Enter village name"
                required
              />
            </label>

            <label>
              Parent Phone Number
              <input
                name="parentPhone"
                type="tel"
                value={form.parentPhone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
            </label>
          </div>

          {error && <div className="student-message error">{error}</div>}
          {message && <div className="student-message success">{message}</div>}

          <div className="student-form-actions">
            {editingId && (
              <button
                type="button"
                className="student-cancel-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="student-submit-button"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Student'
                  : '+ Add Student'}
            </button>
          </div>
        </form>
      </section>

      <section className="student-list-card">
        <div className="student-list-heading">
          <div>
            <h2>Student Records</h2>
            <p>Manage all registered students.</p>
          </div>

          <input
            className="student-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
          />
        </div>

        {loading ? (
          <p className="student-empty">Loading student records...</p>
        ) : error && students.length === 0 ? (
          <p className="student-empty">{error}</p>
        ) : filteredStudents.length === 0 ? (
          <p className="student-empty">No students found.</p>
        ) : (
          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Village</th>
                  <th>Parent Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>#{student.id}</td>
                    <td className="student-name-cell">{student.name}</td>
                    <td>{student.className}</td>
                    <td>{student.village}</td>
                    <td>{student.parentPhone || 'Not provided'}</td>
                    <td>
                      <div className="student-actions">
                        <button
                          className="student-edit-button"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="student-delete-button"
                          onClick={() => handleDelete(student)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default StudentManagement
