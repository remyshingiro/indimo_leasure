import { Navigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

const ProtectedRoute = ({ children, requireAdmin }) => {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Simple Admin Check (You can make this stricter later)
  if (requireAdmin && user.email !== 'admin@kigaliswim.com') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute