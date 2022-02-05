import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, auth }) {
  return auth ? children : <Navigate to="/" />;
}