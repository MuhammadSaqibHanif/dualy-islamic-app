import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Duas from './pages/Duas';
import Challenges from './pages/Challenges';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="duas" element={<Duas />} />
          <Route path="challenges" element={<Challenges />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
