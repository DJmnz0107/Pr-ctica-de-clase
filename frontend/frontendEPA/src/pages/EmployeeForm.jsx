import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/employee.css";

export default function EmpleadoForm({ userType, onLogout }) {
  const initialForm = {
    _id: null,
    name: "",
    lastName: "",
    birthday: "",
    email: "",
    address: "",
    hireDate: "",
    password: "",
    telephone: "",
    dui: "",
    isssNumber: "",
  };

  const [form, setForm] = useState(initialForm);
  const [empleados, setEmpleados] = useState([]);
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
  const navigate = useNavigate();

  const API_REGISTRAR = "https://pr-ctica-de-clase.onrender.com/api/registerEmployee";
  const API_EMPLEADOS = "https://pr-ctica-de-clase.onrender.com/api/employees";

  useEffect(() => {
    if (!userType) {
      navigate("/");
      return;
    }
    fetchEmpleados();
  }, [userType, navigate]);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch(API_EMPLEADOS, {
        credentials: "include",
      });

      if (res.status === 401) {
        onLogout();
        navigate("/");
        return;
      }

      const data = await res.json();
      setEmpleados(data);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
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

    if (!form.birthday) {
      alert("Por favor, ingresa una fecha de nacimiento válida.");
      return;
    }

    try {
      const isEditing = !!form._id;
      const url = isEditing ? `${API_EMPLEADOS}/${form._id}` : API_REGISTRAR;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          onLogout();
          navigate("/");
          return;
        }
        throw new Error(data.message || "Error al registrar/actualizar empleado");
      }

      setMessage(data.message || (isEditing ? "Empleado actualizado" : "Empleado registrado"));
      setForm(initialForm);
      fetchEmpleados();
    } catch (err) {
      setMessage(err.message);
      console.error("Error al guardar empleado:", err);
    }
  };

  const handleEdit = (empleado) => {
    setForm({
      ...empleado,
      password: "", // no mostrar contraseña original
    });
  };

  const handleCancelEdit = () => {
    setForm(initialForm);
    setMessage(null);
  };

  const confirmDeleteEmpleado = (id) => {
    setConfirmDelete({ visible: true, id });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_EMPLEADOS}/${confirmDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("No se pudo eliminar el empleado");

      setMessage("Empleado eliminado");
      fetchEmpleados();
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      setMessage("Error al eliminar empleado");
    }
    setConfirmDelete({ visible: false, id: null });
  };

  const cancelDelete = () => {
    setConfirmDelete({ visible: false, id: null });
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="empleado-container">
      <div className="header-container">
        <h2>{form._id ? "Editar Empleado" : "Registrar Empleado"}</h2>
        <div className="user-info">
          <span>Rol: {userType}</span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {message && <div className="message-success">{message}</div>}

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <input type="date" name="birthday" value={form.birthday} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Fecha de Contratación</label>
          <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required={!form._id} />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input type="text" name="telephone" value={form.telephone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>DUI</label>
          <input type="text" name="dui" value={form.dui} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Número ISSS</label>
          <input type="text" name="isssNumber" value={form.isssNumber} onChange={handleChange} required />
        </div>

        <button type="submit" className="submit-button">
          {form._id ? "Actualizar" : "Guardar"}
        </button>

        {/* Botón Cancelar visible solo al editar */}
        {form._id && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="cancel-button"
            style={{
              marginLeft: "10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="navigation-buttons">
        <Link to="/clientes" className="nav-button">
          Ir a Clientes
        </Link>
        <Link to="/productos" className="nav-button">
          Ir a Productos
        </Link>
      </div>

      <h3 className="employee-list-title">Lista de Empleados</h3>
      {empleados.length === 0 ? (
        <p>No hay empleados registrados</p>
      ) : (
        <ul className="employee-list">
          {empleados.map((emp) => (
            <li key={emp._id}>
              <div className="employee-info">
                <strong>
                  {emp.name} {emp.lastName}
                </strong>
                <span>{emp.email}</span>
              </div>
              <div className="employee-actions">
                <button onClick={() => handleEdit(emp)}>Editar</button>
                <button onClick={() => confirmDeleteEmpleado(emp._id)} className="delete-button">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de confirmación */}
      {confirmDelete.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirmar Eliminación</h4>
            <p>¿Estás seguro que quieres eliminar este empleado?</p>
            <div className="modal-buttons">
              <button onClick={handleDelete} className="confirm-button">
                Sí, eliminar
              </button>
              <button onClick={cancelDelete} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
