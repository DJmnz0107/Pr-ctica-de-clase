import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/product.css";

const API_BASE_URL = "http://localhost:4000/api/products";

export default function ProductoForm({ userType, onLogout }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [productos, setProductos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(API_BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error en la petición");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos", err);
      setMessage("Error al cargar productos");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || form.price === "" || form.stock === "") {
      setMessage("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      let url = API_BASE_URL;
      let method = "POST";

      if (editingId) {
        url = `${API_BASE_URL}/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (!res.ok) throw new Error("Error en la petición");

      const data = await res.json();
      setMessage(editingId ? "Producto actualizado." : "Producto creado.");

      setForm({ name: "", description: "", price: "", stock: "" });
      setEditingId(null);
      cargarProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setMessage("Error al guardar producto");
    }
  };

  const handleEdit = (producto) => {
    setForm({
      name: producto.name,
      description: producto.description || "",
      price: producto.price.toString(),
      stock: producto.stock.toString(),
    });
    setEditingId(producto._id);
    setMessage("");
  };

  // Aquí abrimos la confirmación personalizada en lugar del window.confirm
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      setMessage("Producto eliminado.");
      cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setMessage("Error al eliminar producto");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleCancelEdit = () => {
    setForm({ name: "", description: "", price: "", stock: "" });
    setEditingId(null);
    setMessage("");
  };

  return (
    <div className="producto-container">
      <h2>{editingId ? "Editar Producto" : "Registrar Producto"}</h2>

      {message && <div className="producto-message">{message}</div>}

      <form onSubmit={handleSubmit} className="producto-form">
        <div>
          <label>Nombre *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div>
          <label>Descripción</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción opcional"
          />
        </div>

        <div>
          <label>Precio *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Cantidad en stock *</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
          />
        </div>

        <button type="submit" className="btn-guardar">
          {editingId ? "Actualizar" : "Guardar"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="btn-cancelar"
          >
            Cancelar
          </button>
        )}
      </form>

      <h3>Lista de Productos</h3>

      <ul className="producto-list">
        {productos.length === 0 && <li>No hay productos registrados.</li>}
        {productos.map((p) => (
          <li key={p._id}>
            <div className="producto-info">
              <strong>{p.name}</strong>
              <span>Precio: ${p.price.toFixed(2)}</span>
              <span>Cantidad: {p.stock}</span>
              {p.description && <span>Descripción: {p.description}</span>}
            </div>

            {(userType === "admin" || userType === "employee") && (
              <div>
                <button
                  className="btn-editar"
                  onClick={() => handleEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => handleDelete(p._id)}
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Navegación rápida */}
      <div className="nav-buttons">
        <button onClick={() => navigate("/empleados")} className="btn-nav">
          Empleados
        </button>
        <button onClick={() => navigate("/clientes")} className="btn-nav">
          Clientes
        </button>
      </div>

      <button onClick={onLogout} className="btn-logout">
        Cerrar sesión
      </button>

      {/* Modal confirmación eliminación */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Seguro que quieres eliminar este producto?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="btn-confirm">
                Sí, eliminar
              </button>
              <button onClick={cancelDelete} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
