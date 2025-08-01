import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/Toast/ToastContainer'
import Home from './pages/Home/Home'
import './App.css'
import './components/ErrorBoundary.css'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app">
            <AppRoutes />
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
