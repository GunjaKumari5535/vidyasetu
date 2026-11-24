
import { useEffect, useState } from 'react'
import api from './api'
import './MarksHistory.css'

function MarksHistory({ onBack }) {
  const [marks, setMarks] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [marksRes, studentsRes, subjectsRes] = await Promise.all([
          api.get('/marks'),
          api.get('/students'),
          api.get('/subjects')
        ])

        setMarks(marksRes.data)
        setStudents(studentsRes.data)
        setSubjects(subjectsRes.data)
      } catch (err) {
        console.error('Failed to load marks history:', err)
        setError('Unable to load marks history. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getStudentName = (studentId) => {
    const student = students.find(
      (item) => Number(item.id) === Number(studentId)
    )
    return student?.name || `Student ID: ${studentId}`
  }

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(
      (item) => Number(item.id) === Number(subjectId)
    )
    return subject?.name || `Subject ID: ${subjectId}`
  }

  const getPercentage = (obtained, maximum) => {
    if (!maximum) return 0
    return ((obtained / maximum) * 100).toFixed(1)
  }

  return (
    <div className="marks-history-page">
      <div className="marks-history-header">
        <button className="history-back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <h1>Academic Performance History</h1>
        <p>View all examination marks recorded for students.</p>
      </div>

      {loading ? (
        <p className="history-message">Loading marks history...</p>
      ) : error ? (
        <p className="history-error">{error}</p>
      ) : marks.length === 0 ? (
        <div className="history-empty">
          <h3>No marks recorded yet</h3>
          <p>Marks entered by teachers will appear here.</p>
        </div>
      ) : (
        <>
          <div className="history-summary">
            <h3>Total Records: {marks.length}</h3>
          </div>

          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Exam</th>
                  <th>Marks</th>
                  <th>Percentage</th>
                  <th>Exam Date</th>
                </tr>
              </thead>

              <tbody>
                {marks.map((item) => (
                  <tr key={item.id}>
                    <td>{getStudentName(item.studentId)}</td>
                    <td>{getSubjectName(item.subjectId)}</td>
                    <td>{item.examName}</td>
                    <td>
                      {item.marksObtained} / {item.maxMarks}
                    </td>
                    <td>
                      <span className="history-percentage">
                        {getPercentage(
                          item.marksObtained,
                          item.maxMarks
                        )}%
                      </span>
                    </td>
                    <td>{item.examDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default MarksHistory
