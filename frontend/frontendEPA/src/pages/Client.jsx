import { useState, useEffect } from "react";

export default function ClienteForm() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    birthday: "",
    email: "",
    password: "",
    telephone: "",
    dui: "",
    isVerified: false,
  });

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch("/api/clientes")
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error("Error al cargar clientes", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Cliente creado:", data);
    } catch (err) {
      console.error("Error al guardar cliente:", err);
    }
  };

  return (
    <div>
      <h2>Registrar Cliente</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, value]) => (
          key !== "isVerified" ? (
            <div key={key}>
              <label>{key}:</label>
              <input
                type={key.includes("Date") ? "date" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div key={key}>
              <label>¿Verificado?</label>
              <input
                type="checkbox"
                name="isVerified"
                checked={form.isVerified}
                onChange={handleChange}
              />
            </div>
          )
        ))}
        <button type="submit">Guardar</button>
      </form>

      <h3>Lista de Clientes</h3>
      <ul>
        {clientes.map((cli, idx) => (
          <li key={idx}>{cli.name} {cli.lastName}</li>
        ))}
      </ul>
    </div>
  );
}
