import React, { useState, useEffect } from "react";
import { getTemplate, generateWord } from "./api";

export default function WordTemplate() {
  const [templateId, setTemplateId] = useState("report-template");
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  // Cargar template al seleccionar
  useEffect(() => {
    getTemplate(templateId)
      .then(t => {
        setTemplate(t);
        // Inicializar formData con campos vacíos
        const initData = {};
        t.fields?.forEach(f => { initData[f.name] = ""; });
        setFormData(initData);
      })
      .catch(err => console.error(err));
  }, [templateId]);

  // Manejo cambios en el formulario
  const handleChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Generando documento...");
    try {
      const res = await generateWord(templateId, formData);
      setMessage(`✅ Documento generado: ${res.path}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  if (!template) return <div>Cargando template...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Generador de Word</h1>

      <label>
        Seleccionar template:
        <select value={templateId} onChange={e => setTemplateId(e.target.value)}>
          <option value="report-template">Test Report</option>
          {/* Aquí puedes agregar más opciones */}
        </select>
      </label>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {template.fields?.map(field => (
          <div key={field.name} style={{ marginBottom: "10px" }}>
            <label>{field.label || field.name}:</label>
            <input
              type="text"
              value={formData[field.name] || ""}
              onChange={e => handleChange(e, field.name)}
              style={{ marginLeft: "10px", width: "300px" }}
            />
          </div>
        ))}

        <button type="submit" style={{ marginTop: "10px" }}>Generar Word</button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}
