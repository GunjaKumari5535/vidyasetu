
import { useEffect, useState } from 'react'
import api from './api'
import './ParentChildProgress.css'

function ParentChildProgress({ onBack }) {
  const [children, setChildren] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [marks, setMarks] = useState([])
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [loadingMarks, setLoadingMarks] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await api.get('/parent/children')
        setChildren(response.data)

        if (response.data.length > 0) {
          setSelectedStudentId(String(response.data[0].id))
        }
      } catch (err) {
        console.error('Failed to load children:', err)
        setError('Unable to load your child details.')
      } finally {
        setLoadingChildren(false)
      }
    }

    fetchChildren()
  }, [])

  useEffect(() => {
    if (!selectedStudentId) {
      setMarks([])
      return
    }

    const fetchMarks = async () => {
      setLoadingMarks(true)
      setError('')

      try {
        const response = await api.get(
          `/parent/children/${selectedStudentId}/progress`
        )
        setMarks(response.data)
      } catch (err) {
        console.error('Failed to load marks:', err)
        setMarks([])
        setError('Unable to load academic progress.')
      } finally {
        setLoadingMarks(false)
      }
    }

    fetchMarks()
  }, [selectedStudentId])

  const selectedChild = children.find(
    child => String(child.id) === selectedStudentId
  )

  const calculatePercentage = (obtained, maximum) => {
    if (!maximum || maximum <= 0) return '0.0'
    return ((obtained / maximum) * 100).toFixed(1)
  }

  return (
    <div className="parent-progress-page">
      <div className="parent-progress-header">
        <button onClick={onBack} className="parent-progress-back">
          ← Back to Dashboard
        </button>

        <h1>Child Academic Progress</h1>
        <p>Track your child's examination performance.</p>
      </div>

      {loadingChildren ? (
        <p className="parent-progress-message">Loading child details...</p>
      ) : children.length === 0 ? (
        <div className="parent-progress-empty">
          <h2>No Child Linked</h2>
          <p>Please contact your teacher to link your account with a student.</p>
        </div>
      ) : (
        <>
          <div className="parent-child-card">
            <h2>Child Details</h2>

            <p><strong>Name:</strong> {selectedChild?.name}</p>
            <p><strong>Class:</strong> {selectedChild?.className}</p>
            <p><strong>Village:</strong> {selectedChild?.village}</p>

            {children.length > 1 && (
              <div className="parent-child-selector">
                <label>Select Child</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {children.map(child => (
                    <option key={child.id} value={child.id}>
                      {child.name} - Class {child.className}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="parent-marks-section">
            <h2>Examination History</h2>

            {loadingMarks ? (
              <p className="parent-progress-message">Loading marks...</p>
            ) : error ? (
              <p className="parent-progress-message">{error}</p>
            ) : marks.length === 0 ? (
              <div className="parent-progress-empty">
                <p>No examination records available yet.</p>
              </div>
            ) : (
              <div className="parent-marks-table-wrapper">
                <table className="parent-marks-table">
                  <thead>
                    <tr>
                      <th>Subject ID</th>
                      <th>Exam</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {marks.map(mark => (
                      <tr key={mark.id}>
                        <td>{mark.subjectId ?? '-'}</td>
                        <td>{mark.examName || '-'}</td>
                        <td>
                          {mark.marksObtained ?? 0} / {mark.maxMarks ?? 0}
                        </td>
                        <td>
                          {calculatePercentage(
                            mark.marksObtained,
                            mark.maxMarks
                          )}%
                        </td>
                        <td>{mark.examDate || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ParentChildProgress
