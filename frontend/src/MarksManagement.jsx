
import { useEffect, useState } from 'react'
import api from './api'
import './MarksManagement.css'

function MarksManagement({ onBack }) {
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])

  const [form, setForm] = useState({
    studentId: '',
    subjectId: '',
    examName: '',
    marksObtained: '',
    maxMarks: '100',
    examDate: new Date().toISOString().split('T')[0],
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFormData()
  }, [])

  const fetchFormData = async () => {
    try {
      setLoading(true)

      const [studentResponse, subjectResponse] = await Promise.all([
        api.get('/students'),
        api.get('/subjects'),
      ])

      setStudents(studentResponse.data)
      setSubjects(subjectResponse.data)
    } catch (err) {
      setError('Unable to load students or subjects. Please check your login.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (
      !form.studentId ||
      !form.subjectId ||
      !form.examName.trim() ||
      form.marksObtained === '' ||
      !form.maxMarks ||
      !form.examDate
    ) {
      setError('Please fill all fields.')
      return
    }

    if (
      Number(form.marksObtained) < 0 ||
      Number(form.maxMarks) <= 0 ||
      Number(form.marksObtained) > Number(form.maxMarks)
    ) {
      setError('Please enter valid marks.')
      return
    }

    try {
      setSaving(true)

      await api.post('/marks', {
        studentId: Number(form.studentId),
        subjectId: Number(form.subjectId),
        examName: form.examName.trim(),
        marksObtained: Number(form.marksObtained),
        maxMarks: Number(form.maxMarks),
        examDate: form.examDate,
      })

      setMessage('Marks saved successfully!')

      setForm({
        studentId: '',
        subjectId: '',
        examName: '',
        marksObtained: '',
        maxMarks: '100',
        examDate: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to save marks. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="marks-management">
      <button className="marks-back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="marks-heading">
        <h2>Student Marks Management</h2>
        <p>Enter and maintain students' academic performance.</p>
      </div>

      <div className="marks-card">
        <h3>Enter Examination Marks</h3>

        {loading ? (
          <p>Loading students and subjects...</p>
        ) : (
          <>
            {students.length === 0 && (
              <p className="marks-error">
                No students found. Please add students first.
              </p>
            )}

            {subjects.length === 0 && (
              <p className="marks-error">
                No subjects available. Please add subjects before entering marks.
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="marks-form-grid">

                <div className="marks-field">
                  <label>Select Student</label>
                  <select
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - Class {student.className}
                        (ID: {student.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="marks-field">
                  <label>Select Subject</label>
                  <select
                    name="subjectId"
                    value={form.subjectId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="marks-field">
                  <label>Exam Name</label>
                  <input
                    type="text"
                    name="examName"
                    value={form.examName}
                    onChange={handleChange}
                    placeholder="e.g. Mid Term Examination"
                    required
                  />
                </div>

                <div className="marks-field">
                  <label>Marks Obtained</label>
                  <input
                    type="number"
                    name="marksObtained"
                    value={form.marksObtained}
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter marks"
                    required
                  />
                </div>

                <div className="marks-field">
                  <label>Maximum Marks</label>
                  <input
                    type="number"
                    name="maxMarks"
                    value={form.maxMarks}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="marks-field">
                  <label>Exam Date</label>
                  <input
                    type="date"
                    name="examDate"
                    value={form.examDate}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {error && <p className="marks-error">{error}</p>}
              {message && <p className="marks-success">{message}</p>}

              <button
                className="marks-submit-btn"
                type="submit"
                disabled={saving || students.length === 0 || subjects.length === 0}
              >
                {saving ? 'Saving...' : 'Save Marks'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default MarksManagement
