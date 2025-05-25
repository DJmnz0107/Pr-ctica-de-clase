// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import EmpleadoForm from "./pages/EmployeeForm";
import ProductoForm from "./pages/Product";
import ClienteForm from "./pages/Client";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUserType(userData.userType);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    // También deberías limpiar el token de autenticación aquí
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/empleados" /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/empleados" 
          element={
            isAuthenticated ? 
              <EmpleadoForm userType={userType} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } 
        />
        <Route 
          path="/productos" 
          element={
            isAuthenticated ? 
              <ProductoForm userType={userType} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } 
        />
        <Route 
          path="/clientes" 
          element={
            isAuthenticated ? 
              <ClienteForm userType={userType} onLogout={handleLogout} /> : 
              <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;