
import { useState } from 'react'
import api from './api'
import './ExcelUpload.css'

function ExcelUpload({ onBack }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploadedCount, setUploadedCount] = useState(0)

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      setError('Please select an Excel file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setError('')
    setMessage('')
    setUploadedCount(0)

    try {
      const response = await api.post('/marks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setUploadedCount(response.data.length)
      setMessage('Excel file uploaded successfully!')
      setFile(null)
      e.target.reset()
    } catch (err) {
      console.error('Excel upload failed:', err)
      setError(
        typeof err.response?.data === 'string'
          ? err.response.data
          : 'Excel upload failed. Please check your file and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="excel-upload-page">
      <button className="excel-back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="excel-upload-card">
        <div className="excel-upload-icon">📊</div>

        <h1>Upload Marks Using Excel</h1>
        <p className="excel-subtitle">
          Upload multiple students' examination marks at once.
        </p>

        <form onSubmit={handleUpload}>
          <label className="excel-file-label">
            Select Excel File
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                setFile(e.target.files[0] || null)
                setError('')
                setMessage('')
              }}
            />
          </label>

          {file && (
            <p className="selected-file">
              Selected: {file.name}
            </p>
          )}

          <div className="excel-format-info">
            <h3>Required Excel Columns</h3>
            <p>Keep the first row as column headings.</p>
            <ol>
              <li>Student ID</li>
              <li>Subject ID</li>
              <li>Exam Name</li>
              <li>Marks Obtained</li>
              <li>Maximum Marks</li>
              <li>Exam Date</li>
            </ol>
            <p className="excel-note">
              Use numeric Student IDs and Subject IDs. Enter exam dates as
              actual Excel dates.
            </p>
          </div>

          {message && (
            <div className="excel-success">
              {message} {uploadedCount} record(s) uploaded.
            </div>
          )}

          {error && (
            <div className="excel-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="excel-submit-btn"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Excel File'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ExcelUpload
