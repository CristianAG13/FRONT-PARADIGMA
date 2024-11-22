// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedLayout from './layouts/ProtectedLayout';
import Stats from './components/Stats';
import ErrorLog from './components/Errorlog';
import ErrorDashboard from './components/ErrorDashboard';
import Login from './auth/components/Login';
import ProtectedRoute from './auth/components/ProtectedRoute';
import AuthRedirect from './auth/components/AuthRedirect'; // Importar el nuevo componente

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para manejar la redirección con token */}
        <Route path="/auth-redirect" element={<AuthRedirect />} />

        {/* Rutas Protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          {/* Rutas hijas protegidas */}
          {/* <Route path="stats" element={<Stats />} /> */}
          <Route path="error-log" element={<ErrorLog />} />
          {/* <Route path="dashboard" element={<ErrorDashboard />} /> */}
          {/* Redirección desde la ruta raíz a /stats */}
          <Route index element={<Navigate to="stats" replace />} />
          {/* Ruta wildcard dentro de ProtectedLayout */}
          <Route path="*" element={<Navigate to="stats" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
