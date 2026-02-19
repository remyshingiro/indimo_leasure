import { Navigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Grab the user, the new isAdmin flag, AND the isLoading state
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const isLoading = useAuthStore((state) => state.isLoading)

  // 1. WAIT FOR FIREBASE: Show a blank screen or spinner while checking credentials
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  // 2. NOT LOGGED IN? Send them to the login page.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 3. NEEDS ADMIN BUT ISN'T ONE? Send them back to the home page.
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  // 4. EVERYTHING IS GOOD! Let them in.
  return children
}

export default ProtectedRoute