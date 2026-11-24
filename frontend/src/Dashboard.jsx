
import './Dashboard.css'
import { useEffect, useState } from 'react'
import api from './api'
import StudentManagement from './StudentManagement'
import MarksManagement from './MarksManagement'
import SubjectManagement from './SubjectManagement'
import MarksHistory from './MarksHistory'
import ExcelUpload from './ExcelUpload'
import PerformanceAlerts from './PerformanceAlerts'
import ParentManagement from './ParentManagement'
import ParentChildProgress from './ParentChildProgress'
import ParentAlerts from './ParentAlerts'
import NGOManagement from './NGOManagement'

function Dashboard({ user, onLogout }) {
  const [alerts, setAlerts] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(true)
  const [activePage, setActivePage] = useState('dashboard')

  const role = user?.role?.toUpperCase() || 'STUDENT'

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (role === 'PARENT') {
          const childrenResponse = await api.get('/parent/children')
          const children = childrenResponse.data

          const alertResponses = await Promise.all(
            children.map(child =>
              api.get(`/alerts/student/${child.id}`)
            )
          )

          const allAlerts = alertResponses.flatMap(
            response => response.data
          )

          setAlerts(allAlerts)
        } else if (['ADMIN', 'TEACHER', 'NGO'].includes(role)) {
          const response = await api.get('/alerts')
          setAlerts(response.data)
        }
      } catch (error) {
        console.error('Failed to load alerts:', error)
      } finally {
        setLoadingAlerts(false)
      }
    }

    fetchAlerts()
  }, [role])

  const dashboardFeatures = {
    TEACHER: [
      {
        icon: '👨‍🎓',
        title: 'Student Management',
        description: 'Manage student records and academic details.'
      },
      {
        icon: '👨‍👩‍👧',
        title: 'Parent Management',
        description: 'Create parent accounts and link them to students.'
      },
      {
        icon: '📚',
        title: 'Subject Management',
        description: 'Add and view academic subjects.'
      },
      {
        icon: '📝',
        title: 'Enter Marks',
        description: 'Add subject-wise examination marks.'
      },
      {
        icon: '📊',
        title: 'Marks History',
        description: 'View all previously recorded examination marks.'
      },
      {
        icon: '📊',
        title: 'Upload Excel',
        description: 'Upload student marks using an Excel file.'
      },
      {
        icon: '🔔',
        title: 'Performance Alerts',
        description: 'View alerts for students with low or falling marks.',
        count: true
      }
    ],

    PARENT: [
      {
        icon: '📚',
        title: 'Child Progress',
        description: 'View your child’s academic performance.'
      },
      {
        icon: '🔔',
        title: 'Performance Alerts',
        description: 'Stay informed about low marks and falling performance.',
        count: true
      }
    ],

    NGO: [
      {
        icon: '🎯',
        title: 'Low-Performing Students',
        description: 'Find students who need academic support.'
      },
      {
        icon: '🤝',
        title: 'Volunteer Management',
        description: 'Manage volunteers who support students.'
      },
      {
        icon: '📅',
        title: 'Support Sessions',
        description: 'Schedule and track educational support sessions.'
      },
      {
        icon: '🔔',
        title: 'Performance Alerts',
        description: 'Monitor students who need additional help.',
        count: true
      }
    ],

    STUDENT: [
      {
        icon: '📝',
        title: 'Career Quiz',
        description: 'Answer questions about your interests and strengths.'
      },
      {
        icon: '🎓',
        title: 'Career Recommendations',
        description: 'Explore career and course suggestions.'
      },
      {
        icon: '🏆',
        title: 'Scholarships',
        description: 'Explore available scholarship information.'
      }
    ],

    ADMIN: [
      {
        icon: '👨‍🎓',
        title: 'Student Management',
        description: 'View and manage student records.'
      },
      {
        icon: '👥',
        title: 'User Management',
        description: 'Manage platform users and roles.'
      },
      {
  icon: '🤝',
  title: 'NGO Management',
  description: 'Register NGOs and manage their accounts.'
},
      {
        icon: '📊',
        title: 'Reports',
        description: 'Monitor student performance and platform activity.'
      },
      {
        icon: '🔔',
        title: 'Performance Alerts',
        description: 'Monitor academic performance alerts.',
        count: true
      }
    ]
  }

  const features = dashboardFeatures[role] || dashboardFeatures.STUDENT

  const clickableFeatures = [
    'Student Management',
    'Parent Management',
    'Child Progress',
    'Subject Management',
    'Enter Marks',
    'NGO Management',
    'Marks History',
    'Upload Excel',
    'Performance Alerts'
    
  ]

  const handleFeatureClick = (title) => {
    if (title === 'Student Management') {
      setActivePage('students')
    } else if (title === 'Parent Management') {
      setActivePage('parentManagement')
    } else if (title === 'Child Progress') {
      setActivePage('childProgress')
    } else if (title === 'Subject Management') {
      setActivePage('subjects')
    } else if (title === 'Enter Marks') {
      setActivePage('marks')
    } else if (title === 'Marks History') {
      setActivePage('marksHistory')
    } 
    else if (title === 'NGO Management') {
  setActivePage('ngoManagement')
}else if (title === 'Upload Excel') {
      setActivePage('excelUpload')
    } else if (title === 'Performance Alerts') {
      setActivePage(
        role === 'PARENT' ? 'parentAlerts' : 'performanceAlerts'
      )
    }
  }

  if (activePage === 'students') {
    return <StudentManagement onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'subjects') {
    return <SubjectManagement onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'marks') {
    return <MarksManagement onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'marksHistory') {
    return <MarksHistory onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'excelUpload') {
    return <ExcelUpload onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'performanceAlerts') {
    return <PerformanceAlerts onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'parentManagement') {
    return <ParentManagement onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'childProgress') {
    return <ParentChildProgress onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'parentAlerts') {
    return <ParentAlerts onBack={() => setActivePage('dashboard')} />
  }

  if (activePage === 'ngoManagement') {
  return <NGOManagement onBack={() => setActivePage('dashboard')} />
}

  return (
    <div className="dashboard-page">
      <nav className="dashboard-navbar">
        <div className="brand">
          <span className="brand-icon">V</span>
          <span>VidyaSetu</span>
        </div>

        <div className="dashboard-nav-right">
          <span>{role}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <div>
            <span className="welcome-label">YOUR LEARNING COMMUNITY</span>
            <h1>
              Welcome back, <span>{user.name}!</span>
            </h1>
            <p>
              Together, we can build brighter futures through education,
              guidance and community support.
            </p>
          </div>

          <div className="dashboard-profile">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className="role-badge">{role}</span>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>
            {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard
          </h2>
          <p>Welcome to your VidyaSetu workspace.</p>

          <div className="dashboard-cards">
            {features.map((feature) => (
              <div
                className="dashboard-card"
                key={feature.title}
                onClick={() => handleFeatureClick(feature.title)}
                style={{
                  cursor: clickableFeatures.includes(feature.title)
                    ? 'pointer'
                    : 'default'
                }}
              >
                <span className="card-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>

                {feature.count && (
                  <h2>{loadingAlerts ? '...' : alerts.length}</h2>
                )}

                <p>{feature.description}</p>

                {clickableFeatures.includes(feature.title) && (
                  <span className="student-card-link">
                    Open {feature.title} →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
