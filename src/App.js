import { useContext  } from 'react';
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import Auth from "./pages/Auth/Auth";
import styled from "styled-components";
import { UserContext } from "./context/UserContext";

const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
`;
function App() {
  const { user } = useContext(UserContext);

  return (
    <AppWrapper>
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
    </AppWrapper>
  );
}

export default App;
