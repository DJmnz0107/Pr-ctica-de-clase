// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmpleadoForm from "./pages/EmployeeForm";
import ProductoForm from "./pages/Product";
import ClienteForm from "./pages/Client";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/empleados" />} />
        <Route path="/empleados" element={<EmpleadoForm />} />
        <Route path="/productos" element={<ProductoForm />} />
        <Route path="/clientes" element={<ClienteForm />} />
      </Routes>
    </Router>
  );
}

export default App;
