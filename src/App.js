import { useContext  } from 'react';
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import Auth from "./pages/Auth/Auth";
import { UserContext } from "./context/UserContext";
function App() {
  
  const { user } = useContext(UserContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<Auth />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute auth={user}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h1>Create 404 Page here</h1>} />
      </Routes>
    </div>
  );
}

export default App;
