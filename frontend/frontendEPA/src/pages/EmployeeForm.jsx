import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/employee.css";

export default function EmpleadoForm() {
  const initialForm = {
    name: "",
    lastName: "",
    birthday: "",
    email: "",
    address: "",
    hireDate: "",
    password: "",
    telephone: "",
    dui: "",
    isssNumber: ""
  };

  const [form, setForm] = useState(initialForm);
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = () => {
    fetch("/api/employees")
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(err => console.error("Error al cargar empleados", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) {
        throw new Error("Error al guardar empleado: " + res.statusText);
      }
  
      const data = await res.json();
      console.log("Empleado creado:", data);
    } catch (err) {
      console.error("Error al guardar empleado:", err);
    }
  };
  
  const handleEdit = (empleado) => {
    setForm(empleado); // Cargar en el formulario
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    try {
      await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      fetchEmpleados();
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
    }
  };

  return (
    <div className="empleado-container">
      <h2 className="empleado-heading">
        {form._id ? "Editar Empleado" : "Registrar Empleado"}
      </h2>

      <form onSubmit={handleSubmit} className="empleado-form">
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="empleado-input-group">
            <label className="empleado-label">{key}:</label>
            <input
              type={key.includes("Date") ? "date" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              className="empleado-input"
            />
          </div>
        ))}
        <button type="submit" className="empleado-button">
          {form._id ? "Actualizar" : "Guardar"}
        </button>
      </form>

      <Link to="/clientes">
        <button className="empleado-button secondary">Ir a Clientes</button>
      </Link>

      <h3 className="empleado-heading">Lista de Empleados</h3>
      <ul className="empleado-list">
        {empleados.map((emp) => (
          <li key={emp._id} className="empleado-list-item">
            <strong>{emp.name} {emp.lastName}</strong> — {emp.email}
            <p>
              Verificado:{" "}
              <span style={{ color: emp.isVerified ? "green" : "red", fontWeight: "bold" }}>
                {emp.isVerified ? "Sí" : "No"}
              </span>
            </p>
            <div style={{ marginTop: "5px" }}>
              <button
                onClick={() => handleEdit(emp)}
                className="empleado-button"
                style={{ marginRight: "10px", backgroundColor: "#f39c12" }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(emp._id)}
                className="empleado-button"
                style={{ backgroundColor: "#e74c3c" }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
