import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/client.css";

export default function ClienteForm({ userType, onLogout }) {
  const initialClientForm = {
    _id: null,
    name: "",
    lastName: "",
    birthday: "",
    email: "",
    password: "",
    telephone: "",
    dui: "",
    isVerified: true, // Establecido como true por defecto
  };

  const [clientForm, setClientForm] = useState(initialClientForm);
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState(null);
  const [confirmDeleteClient, setConfirmDeleteClient] = useState({ visible: false, id: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  const API_BASE = "https://pr-ctica-de-clase.onrender.com/api";
  const API_REGISTER_CLIENT = `${API_BASE}/registerClients`;
  const API_CLIENTS = `${API_BASE}/clients`;

  useEffect(() => {
    if (!userType) {
      navigate("/");
      return;
    }
    fetchClients();
  }, [userType, navigate, refreshKey]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_CLIENTS, { 
        credentials: "include" 
      });
      
      if (res.status === 401) {
        onLogout();
        navigate("/");
        return;
      }
      
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("Error loading clients:", err);
      setMessage("Error al cargar los clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientForm({
      ...clientForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isEditing = !!clientForm._id;
      
      if (isEditing) {
        const res = await fetch(`${API_CLIENTS}/${clientForm._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientForm),
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            onLogout();
            navigate("/");
            return;
          }
          throw new Error(data.message || "Error al actualizar el cliente");
        }

        setMessage("Cliente actualizado correctamente");
        setClientForm(initialClientForm);
        setRefreshKey(prev => prev + 1);
      } else {
        // Enviar siempre con isVerified: true
        const registrationData = {
          ...clientForm,
          isVerified: true
        };

        const res = await fetch(API_REGISTER_CLIENT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registrationData),
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            onLogout();
            navigate("/");
            return;
          }
          throw new Error(data.message || "Error al registrar el cliente");
        }

        setMessage("Cliente registrado exitosamente");
        setClientForm(initialClientForm);
        setRefreshKey(prev => prev + 1);
      }
    } catch (err) {
      setMessage(err.message);
      console.error("Error saving client:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client) => {
    setClientForm({
      ...client,
      password: "",
    });
    setMessage(null);
  };

  const resetForm = () => {
    setClientForm(initialClientForm);
    setMessage(null);
  };

  const confirmDelete = (id) => {
    setConfirmDeleteClient({ visible: true, id });
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_CLIENTS}/${confirmDeleteClient.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("No se pudo eliminar el cliente");

      setMessage("Cliente eliminado correctamente");
      setRefreshKey(prev => prev + 1);
      resetForm();
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      setMessage("Error al eliminar cliente");
    } finally {
      setConfirmDeleteClient({ visible: false, id: null });
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteClient({ visible: false, id: null });
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const filteredClients = clients.filter((cli) => {
    const fullName = `${cli.name} ${cli.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      cli.email.toLowerCase().includes(search) ||
      cli.dui.toLowerCase().includes(search)
    );
  });

  return (
    <div className="client-container">
      <div className="client-header-container">
        <h2>{clientForm._id ? "Editar Cliente" : "Registrar Cliente"}</h2>
        <div className="client-user-info">
          <span>Rol: {userType}</span>
          <button onClick={handleLogout} className="client-logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {message && (
        <div className={`client-message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="client-form">
        <div className="client-form-group">
          <label>Nombre</label>
          <input 
            type="text" 
            name="name" 
            value={clientForm.name} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </div>

        <div className="client-form-group">
          <label>Apellido</label>
          <input 
            type="text" 
            name="lastName" 
            value={clientForm.lastName} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </div>

        <div className="client-form-group">
          <label>Fecha de Nacimiento</label>
          <input 
            type="date" 
            name="birthday" 
            value={clientForm.birthday} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </div>

        <div className="client-form-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            name="email" 
            value={clientForm.email} 
            onChange={handleChange} 
            required 
            disabled={isLoading || !!clientForm._id}
          />
        </div>

        <div className="client-form-group">
          <label>Contraseña</label>
          <input 
            type="password" 
            name="password" 
            value={clientForm.password} 
            onChange={handleChange} 
            required={!clientForm._id}
            disabled={isLoading}
          />
        </div>

        <div className="client-form-group">
          <label>Teléfono</label>
          <input 
            type="text" 
            name="telephone" 
            value={clientForm.telephone} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </div>

        <div className="client-form-group">
          <label>DUI</label>
          <input 
            type="text" 
            name="dui" 
            value={clientForm.dui} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </div>

        <div className="client-checkbox-group">
          <label>¿Verificado?</label>
          <input 
            type="checkbox" 
            name="isVerified" 
            checked={true} // Siempre marcado como verificado
            readOnly 
          />
        </div>

        <div className="client-form-actions">
          <button 
            type="submit" 
            className="client-submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : (clientForm._id ? "Actualizar" : "Registrar")}
          </button>

          {clientForm._id && (
            <button
              type="button"
              onClick={resetForm}
              className="client-cancel-button"
              disabled={isLoading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="client-navigation-buttons">
        <Link to="/empleados" className="client-nav-button">
          Ir a Empleados
        </Link>
        <Link to="/productos" className="client-nav-button">
          Ir a Productos
        </Link>
      </div>

      <div className="client-filter-container">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o DUI"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="client-filter-input"
          disabled={isLoading}
        />
      </div>

      <h3 className="client-list-title">Lista de Clientes</h3>
      
      {isLoading ? (
        <div className="client-loading">Cargando clientes...</div>
      ) : filteredClients.length === 0 ? (
        <p className="client-empty">No se encontraron clientes</p>
      ) : (
        <ul className="client-list">
          {filteredClients.map((cli) => (
            <li key={cli._id} className="client-item">
              <div className="client-info">
                <strong>
                  {cli.name} {cli.lastName}
                </strong>
                <span>Email: {cli.email}</span>
                <span>Teléfono: {cli.telephone}</span>
                <span>DUI: {cli.dui}</span>
                <span className="verified">✅ Verificado</span>
              </div>
              <div className="client-actions">
                <button 
                  onClick={() => handleEdit(cli)}
                  disabled={isLoading}
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDelete(cli._id)}
                  className="client-cancel-button"
                  disabled={isLoading}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {confirmDeleteClient.visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirmar Eliminación</h4>
            <p>¿Estás seguro que deseas eliminar este cliente?</p>
            <div className="modal-buttons">
              <button 
                onClick={handleDelete} 
                className="client-confirm-button"
                disabled={isLoading}
              >
                {isLoading ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button 
                onClick={cancelDelete} 
                className="client-cancel-button"
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}