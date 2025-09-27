import React, { useState, useEffect } from "react";

export default function ITEForm() {
  const hoy = new Date().toISOString().slice(0, 10);
  const API_URL = import.meta.env.VITE_API_URL;

  const initialFormData = {
    promotor: "",
    arquitecta: "",
    nColegiada: "",

    titulo: "",
    direccion: "",
    numero: "",
    codigoPostal: "",
    poblacion: "",
    anioConstruccion: "",
    referenciaCatastral: "",
    usoPrincipal: "",

    nombreComunidad: "",
    nombrePresidente: "",
    administrador: "",
    
    nOferta: "",
    fechaOferta: "",
    plantas: "",
    viviendas: "",

    tipologiaEstructura: "",
    cerramientos: "",
    revestimientoExterior: "",
    cubiertaTipo: "",
    patiosTipo: "",
     
    fotoPortada: null,
    previewFotoPortada: null,
    
    fotoEmplazamiento: null,
    previewFotoEmplazamiento: null, 

    emplazamiento: "",

    motivoInspeccion: "",
    fechaVisita: hoy,
    observacionesPrevias: "",

    patologias: [],

    conclusiones: "",
    actuaciones: [],
    presupuesto: [{ partida: "", unidades: "", precioUnitario: "", total: "" }],
    notas: "",
  };

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : initialFormData;
  });

  const tiposPatologias = [
    "Fisuras",
    "Desconches",
    "Humedades",
    "Barandillas",
    "Gresite",
    "Lucernarios",
    "Balcones",
    "Instalaciones",
    "Patios",
    "Otra",
  ];

  // 🔹 Manejador de cambios para campos simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper para subida de la foto de portada
  const handleMainPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        fotoPortada: file,
        previewFotoPortada: previewUrl,
      }));
    }
  };

  const handleSecondaryPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        fotoEmplazamiento: file,
        previewFotoEmplazamiento: previewUrl,
      }));
    }
  };

  const addActuacion = () => {
    setFormData(prev => ({
      ...prev,
      actuaciones: [...prev.actuaciones, ""],
    }));
  };

  const updateActuacion = (index, value) => {
    setFormData(prev => ({
      ...prev,
      actuaciones: prev.actuaciones.map((act, i) => i === index ? value : act)
    }));
  };

  const addPatologia = () => {
    setFormData(prev => ({
      ...prev,
      patologias: [
        ...prev.patologias,
        {
          tipo: "",
          pisos: "",
          descripcion: "",
          grado: 0,
          imagenes: [],
          preview: [],
        },
      ],
    }));
  };

  const addPartida = () => {
    setFormData(prev => ({
      ...prev,
      presupuesto: [
        ...prev.presupuesto,
        { partida: "", unidades: "", precioUnitario: "", total: "" },
      ],
    }));
  };

  // 🔧 Actualizar una patología
  const updatePatologia = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      patologias: prev.patologias.map((pat, i) => 
        i === index ? { ...pat, [field]: value } : pat
      )
    }));
  };

  // 🔧 Subir imágenes para una patología concreta
  const handleImageUpload = (index, files) => {
    const filesArray = Array.from(files);
    const previewArray = filesArray.map((file) => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      patologias: prev.patologias.map((pat, i) => 
        i === index ? {
          ...pat,
          imagenes: [...pat.imagenes, ...filesArray],
          preview: [...pat.preview, ...previewArray]
        } : pat
      )
    }));
  };

  // 🔧 Eliminar patología
  const removePatologia = (index) => {
    setFormData(prev => ({
      ...prev,
      patologias: prev.patologias.filter((_, i) => i !== index)
    }));
  };

  // 🔧 Actualizar partida de presupuesto
  const updatePartida = (index, field, value) => {
    setFormData(prev => {
      const nuevasPartidas = [...prev.presupuesto];
      nuevasPartidas[index] = { ...nuevasPartidas[index], [field]: value };
      
      // Calcular total automáticamente si son unidades y precio unitario
      if (field === "unidades" || field === "precioUnitario") {
        const unidades = parseFloat(nuevasPartidas[index].unidades) || 0;
        const precioUnitario = parseFloat(nuevasPartidas[index].precioUnitario) || 0;
        nuevasPartidas[index].total = (unidades * precioUnitario).toFixed(2);
      }
      
      return { ...prev, presupuesto: nuevasPartidas };
    });
  };

  // 🔧 Eliminar imagen de patología
  const removeImage = (patologiaIndex, imageIndex) => {
    setFormData(prev => ({
      ...prev,
      patologias: prev.patologias.map((pat, i) => 
        i === patologiaIndex ? {
          ...pat,
          imagenes: pat.imagenes.filter((_, imgIndex) => imgIndex !== imageIndex),
          preview: pat.preview.filter((_, imgIndex) => imgIndex !== imageIndex)
        } : pat
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      // 1️⃣ Template ID
      fd.append("template_id", "informe_eustasio");

      // 2️⃣ Datos del formulario como JSON
      fd.append("form_data", JSON.stringify(formData));

      // 2.5️⃣ Añadir foto de portada
      if (formData.fotoPortada) {
        fd.append("foto_portada", formData.fotoPortada);
      }
      
      // 2.5️⃣ Añadir foto emplazamiento
      if (formData.fotoEmplazamiento) {
        fd.append("foto_emplazamiento", formData.fotoEmplazamiento);
      }

      // 3️⃣ Añadir imágenes reales de cada patología
      formData.patologias.forEach((p, i) => {
        p.imagenes.forEach((file) => {
          fd.append(`patologia_${i}_images`, file);
        });
      });

      // 4️⃣ Llamada al backend
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error generando Word");
      }

      // 5️⃣ Descargar Word
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Informe_ITE.docx";
      a.click();
      
      // Limpiar URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generando informe: " + err.message);
    }
  };

  // 🔹 Persistir en localStorage cuando cambie formData
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // 🔹 Botón de "Nuevo proyecto"
  const handleReset = () => {
    if (window.confirm("¿Estás seguro de que quieres empezar un nuevo proyecto? Se perderán todos los datos no guardados.")) {
      setFormData(initialFormData);
      localStorage.removeItem("formData");
    }
  };

  // 🔹 Calcular total del presupuesto
  const totalPresupuesto = formData.presupuesto.reduce((total, partida) => {
    return total + (parseFloat(partida.total) || 0);
  }, 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl mx-auto p-6 border rounded-lg shadow bg-white"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Inspección Técnica de Edificios</h1>
        <button
          type="button"
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Nuevo proyecto
        </button>
      </div>

      {/* DATOS GENERALES */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h2 className="text-xl font-bold text-gray-700">Datos Generales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="titulo"
            placeholder="Título del informe"
            value={formData.titulo}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            name="direccion"
            placeholder="Dirección Completa"
            value={formData.direccion}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="promotor"
            placeholder="Promotor"
            value={formData.promotor}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            name="arquitecta"
            placeholder="Arquitecta"
            value={formData.arquitecta}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            name="nColegiada"
            placeholder="Nº colegiada"
            value={formData.nColegiada}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h3 className="font-bold mt-4 text-gray-700">Datos de la oferta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nOferta"
            placeholder="Nº de oferta"
            value={formData.nOferta}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="date"
            name="fechaOferta"
            value={formData.fechaOferta}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h3 className="font-bold mt-4 text-gray-700">Datos del edificio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de la visita</label>
            <input
              type="date"
              name="fechaVisita"
              value={formData.fechaVisita}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <input
            type="text"
            name="plantas"
            placeholder="Nº de plantas"
            value={formData.plantas}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            name="viviendas"
            placeholder="Nº de viviendas por planta"
            value={formData.viviendas}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Foto Portada</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainPhotoUpload}
              className="w-full p-2 border rounded"
            />
            {formData.previewFotoPortada && (
              <div className="mt-2">
                <img
                  src={formData.previewFotoPortada}
                  alt="Foto portada"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Plano de emplazamiento</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSecondaryPhotoUpload}
              className="w-full p-2 border rounded"
            />
            {formData.previewFotoEmplazamiento && (
              <div className="mt-2">
                <img
                  src={formData.previewFotoEmplazamiento}
                  alt="Foto de emplazamiento"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EMPLAZAMIENTO Y CARACTERÍSTICAS */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-xl font-bold text-gray-700">Emplazamiento y Características</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Emplazamiento y colindantes</label>
          <textarea
            name="emplazamiento"
            placeholder="Describe el emplazamiento y colindantes..."
            value={formData.emplazamiento}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tipología de estructura</label>
            <select
              name="tipologiaEstructura"
              value={formData.tipologiaEstructura}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona...</option>
              <option value="Hormigón">Hormigón</option>
              <option value="Madera">Madera</option>
              <option value="Metálica">Metálica</option>
              <option value="Mixta">Mixta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cerramientos</label>
            <input
              type="text"
              name="cerramientos"
              placeholder="Ladrillo, bloque, etc."
              value={formData.cerramientos}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Revestimiento exterior</label>
            <input
              type="text"
              name="revestimientoExterior"
              placeholder="Revoco, piedra, etc."
              value={formData.revestimientoExterior}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de cubierta</label>
            <select
              name="cubiertaTipo"
              value={formData.cubiertaTipo}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona...</option>
              <option value="Inclinada dos aguas">Inclinada a dos aguas</option>
              <option value="Plana transitable">Plana transitable</option>
              <option value="Plana no transitable">Plana no transitable</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Descripción de patios/interiores</label>
          <textarea
            name="patiosTipo"
            placeholder="Descripción de patios, ventilación, iluminación..."
            value={formData.patiosTipo}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
      </div>

      {/* ANTECEDENTES */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-xl font-bold text-gray-700">Antecedentes</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Motivo de la inspección</label>
          <textarea
            name="motivoInspeccion"
            placeholder="Motivo de la inspección..."
            value={formData.motivoInspeccion}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Observaciones previas</label>
          <textarea
            name="observacionesPrevias"
            placeholder="Observaciones previas..."
            value={formData.observacionesPrevias}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
      </div>

      {/* PATOLOGÍAS */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-xl font-bold text-gray-700">Patologías Detectadas</h3>

        {formData.patologias.map((pat, index) => (
          <div key={index} className="border p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Patología #{index + 1}</h4>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => removePatologia(index)}
              >
                Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de patología</label>
                <select
                  value={pat.tipo}
                  onChange={(e) => updatePatologia(index, "tipo", e.target.value)}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona tipo...</option>
                  {tiposPatologias.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Pisos afectados</label>
                <input
                  type="text"
                  placeholder="Pisos afectados"
                  value={pat.pisos}
                  onChange={(e) => updatePatologia(index, "pisos", e.target.value)}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
                <textarea
                  placeholder="Descripción detallada"
                  value={pat.descripcion}
                  onChange={(e) => updatePatologia(index, "descripcion", e.target.value)}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Grado de actuación (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="1-5"
                  value={pat.grado}
                  onChange={(e) => updatePatologia(index, "grado", e.target.value)}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Imágenes</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e.target.files)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {pat.preview.map((url, i) => (
                  <div key={i} className="relative">
                    <img 
                      src={url} 
                      alt={`preview-${i}`} 
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={addPatologia}
        >
          + Añadir patología
        </button>
      </div>

      {/* CONCLUSIONES */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-xl font-bold text-gray-700">Conclusiones</h3>
        <textarea
          name="conclusiones"
          placeholder="Conclusiones de la inspección..."
          value={formData.conclusiones}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
      </div>

      {/* ACTUACIONES */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-xl font-bold text-gray-700">Posibles Actuaciones</h3>
        {formData.actuaciones.map((act, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder={`Actuación ${index + 1}`}
              value={act}
              onChange={(e) => updateActuacion(index, e.target.value)}
              className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={addActuacion}
        >
          + Añadir actuación
        </button>
      </div>

      {/* PRESUPUESTO */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-xl font-bold text-gray-700">Presupuesto Preliminar</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Partida</th>
                <th className="border p-2 text-left">Unidades</th>
                <th className="border p-2 text-left">Precio Unitario (€)</th>
                <th className="border p-2 text-left">Total (€)</th>
              </tr>
            </thead>
            <tbody>
              {formData.presupuesto.map((partida, index) => (
                <tr key={index}>
                  <td className="border p-1">
                    <input
                      type="text"
                      placeholder="Descripción"
                      value={partida.partida}
                      onChange={(e) => updatePartida(index, "partida", e.target.value)}
                      className="w-full p-1 border-none focus:outline-none"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      placeholder="0"
                      value={partida.unidades}
                      onChange={(e) => updatePartida(index, "unidades", e.target.value)}
                      className="w-full p-1 border-none focus:outline-none"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={partida.precioUnitario}
                      onChange={(e) => updatePartida(index, "precioUnitario", e.target.value)}
                      className="w-full p-1 border-none focus:outline-none"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={partida.total}
                      onChange={(e) => updatePartida(index, "total", e.target.value)}
                      className="w-full p-1 border-none focus:outline-none bg-gray-50"
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td colSpan="3" className="border p-2 text-right">TOTAL:</td>
                <td className="border p-2">{totalPresupuesto.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={addPartida}
        >
          + Añadir partida
        </button>
      </div>

      {/* NOTAS FINALES */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-xl font-bold text-gray-700">Notas Finales</h3>
        <textarea
          name="notas"
          placeholder="Notas finales..."
          value={formData.notas}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
      </div>

      {/* BOTÓN FINAL */}
      <div className="flex justify-center pt-6">
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
        >
          Generar Informe Word
        </button>
      </div>
    </form>
  );
}