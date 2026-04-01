import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // ❌ if no user → go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ if user exists → allow access
  return children;
}

export default ProtectedRoute;