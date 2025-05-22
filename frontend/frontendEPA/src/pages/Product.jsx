import { useState, useEffect } from "react";

export default function ProductoForm() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
  });

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar productos", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Producto creado:", data);
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  };

  return (
    <div>
      <h2>Registrar Producto</h2>
      <form onSubmit={handleSubmit}>
        {["nombre", "descripcion", "precio", "cantidad"].map(field => (
          <div key={field}>
            <label>{field}:</label>
            <input type="text" name={field} value={form[field]} onChange={handleChange} />
          </div>
        ))}
        <button type="submit">Guardar</button>
      </form>

      <h3>Lista de Productos</h3>
      <ul>
        {productos.map((p, idx) => (
          <li key={idx}>{p.nombre} - ${p.precio}</li>
        ))}
      </ul>
    </div>
  );
}
