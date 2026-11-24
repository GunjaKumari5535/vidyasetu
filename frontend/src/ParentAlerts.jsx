
import { useEffect, useState } from 'react'
import api from './api'
import './ParentAlerts.css'

function ParentAlerts({ onBack }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchParentAlerts = async () => {
      try {
        const childrenResponse = await api.get('/parent/children')
        const children = childrenResponse.data

        const alertResponses = await Promise.all(
          children.map(child =>
            api.get(`/alerts/student/${child.id}`)
          )
        )

        const allAlerts = alertResponses.flatMap(response => response.data)

        allAlerts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setAlerts(allAlerts)
      } catch (err) {
        console.error('Failed to load parent alerts:', err)
        setError('Unable to load performance alerts.')
      } finally {
        setLoading(false)
      }
    }

    fetchParentAlerts()
  }, [])

  return (
    <div className="parent-alerts-page">
      <div className="parent-alerts-header">
        <button onClick={onBack} className="parent-alerts-back">
          ← Back to Dashboard
        </button>

        <h1>Performance Alerts</h1>
        <p>Stay informed about your child's academic performance.</p>
      </div>

      <div className="parent-alerts-content">
        {loading ? (
          <p className="parent-alerts-empty">Loading alerts...</p>
        ) : error ? (
          <p className="parent-alerts-empty">{error}</p>
        ) : alerts.length === 0 ? (
          <div className="parent-alerts-empty">
            <h2>No Alerts</h2>
            <p>There are no performance alerts for your child right now.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div className="parent-alert-card" key={alert.id}>
              <div className="parent-alert-top">
                <h3>
                  {alert.alertType === 'LOW_PERFORMANCE'
                    ? 'Low Performance'
                    : alert.alertType === 'FALLING_PERFORMANCE'
                      ? 'Falling Performance'
                      : alert.alertType}
                </h3>

                <span className="parent-alert-percentage">
                  {Number(alert.percentage ?? 0).toFixed(1)}%
                </span>
              </div>

              <p>{alert.message}</p>

              <div className="parent-alert-footer">
                <span>Status: {alert.status || 'NEW'}</span>
                <span>
                  {alert.createdAt
                    ? new Date(alert.createdAt).toLocaleString()
                    : '-'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ParentAlerts
