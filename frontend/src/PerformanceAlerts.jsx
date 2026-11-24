
import { useEffect, useState } from 'react'
import api from './api'
import './PerformanceAlerts.css'

function PerformanceAlerts({ onBack }) {
  const [alerts, setAlerts] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const [alertsResponse, studentsResponse] = await Promise.all([
          api.get('/alerts'),
          api.get('/students')
        ])

        setAlerts(alertsResponse.data)
        setStudents(studentsResponse.data)
      } catch (err) {
        console.error('Failed to load performance alerts:', err)
        setError('Unable to load performance alerts. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const getStudentName = (studentId) => {
    const student = students.find(
      item => Number(item.id) === Number(studentId)
    )

    return student?.name || `Student ID: ${studentId ?? 'Unknown'}`
  }

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  return (
    <div className="performance-alerts-page">
      <button className="alerts-back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="alerts-header">
        <h1>Performance Alerts</h1>
        <p>
          Monitor students who need academic attention and support.
        </p>
      </div>

      {loading ? (
        <p className="alerts-message">Loading performance alerts...</p>
      ) : error ? (
        <p className="alerts-error">{error}</p>
      ) : alerts.length === 0 ? (
        <div className="alerts-empty">
          <h3>No Performance Alerts</h3>
          <p>There are no student performance alerts at the moment.</p>
        </div>
      ) : (
        <>
          <div className="alerts-summary">
            <h3>Total Alerts: {alerts.length}</h3>
            <p>Students requiring attention</p>
          </div>

          <div className="alerts-list">
            {alerts.map(alert => (
              <div className="performance-alert-card" key={alert.id}>
                <div className="alert-card-top">
                  <div>
                    <h3>{getStudentName(alert.studentId)}</h3>
                    <span className="alert-student-id">
                      Student ID: {alert.studentId ?? 'Unknown'}
                    </span>
                  </div>

                  <span className={`alert-type ${
                    alert.alertType === 'LOW_PERFORMANCE'
                      ? 'low-alert'
                      : 'falling-alert'
                  }`}>
                    {(alert.alertType || 'GENERAL ALERT').replaceAll('_', ' ')}
                  </span>
                </div>

                <p className="alert-description">
                  {alert.message || 'No additional message available.'}
                </p>

                <div className="alert-details">
                  <div>
                    <span>Percentage</span>
                    <strong>
                      {alert.percentage != null
                        ? `${alert.percentage}%`
                        : '—'}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>{alert.status || '—'}</strong>
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>{formatDate(alert.createdAt)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default PerformanceAlerts
