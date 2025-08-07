import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PrivateRoute = ({ children, adminOnly = false, coachOnly = false, userOnly = false }) => {
  const { isAuthenticated, isAdmin, isCoach, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }
  if (coachOnly && !isCoach) {
    return <Navigate to="/" replace />
  }
  if (userOnly && (isAdmin || isCoach)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
