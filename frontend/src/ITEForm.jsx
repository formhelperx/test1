import React, { useState } from "react";


export default function ITEForm() {
  const hoy = new Date().toISOString().slice(0, 10);
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({

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
     
    fotoPortada: null, // Aquí se guardará el objeto File
    previewFotoPortada: null, // Aquí la URL para la previsualización
    
    fotoEmplazamiento: null,
    previewFotoEmplazamiento: null, 

    emplazamiento: "",


    motivoInspeccion: "",
    fechaVisita: "",
    observacionesPrevias: "",

    patologias: [],

    conclusiones: "",
    actuaciones: [],
    presupuesto: [{ partida: "", unidades: "", precioUnitario: "", total: "" }],
    notas: "",
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

  // Helper para subida de la foto de portada
  const handleMainPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        fotoPortada: file,
        previewFotoPortada: previewUrl,
      });
    }
  };
  const handleSecondaryPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        fotoEmplazamiento: file,
        previewFotoEmplazamiento: previewUrl,
      });
    }
  };

  const addActuacion = () => {
    setFormData({
      ...formData,
      actuaciones: [...formData.actuaciones, ""],
    });
  };

  const updateActuacion = (index, value) => {
    const nuevas = [...formData.actuaciones];
    nuevas[index] = value;
    setFormData({ ...formData, actuaciones: nuevas });
  };
    const addPatologia = () => {
    setFormData({
      ...formData,
      patologias: [
        ...formData.patologias,
        {
          tipo: "", // el usuario puede escribir "Fisuras", "Humedades", etc.
          pisos: "",
          descripcion: "",
          grado: 0,
          imagenes: [],
          preview: [],
        },
      ],
    });
  };

  const addPartida = () => {
    setFormData({
      ...formData,
      presupuesto: [
        ...formData.presupuesto,
        { partida: "", unidades: "", precioUnitario: "", total: "" },
      ],
    });
  };

  const updatePartida = (index, field, value) => {
    const nuevas = [...formData.presupuesto];
    nuevas[index][field] = value;
    setFormData({ ...formData, presupuesto: nuevas });
  };
   // 🔧 Actualizar un campo de una patología
  const updatePatologia = (index, field, value) => {
    const nuevas = [...formData.patologias];
    nuevas[index][field] = value;
    setFormData({ ...formData, patologias: nuevas });
  };

  // 🔧 Subir imágenes para una patología concreta
  const handleImageUpload = (index, files) => {
    const filesArray = Array.from(files);
    const previewArray = filesArray.map((file) => URL.createObjectURL(file));

    const nuevas = [...formData.patologias];
    nuevas[index].imagenes = [...nuevas[index].imagenes, ...filesArray];
    nuevas[index].preview = [...nuevas[index].preview, ...previewArray];

    setFormData({ ...formData, patologias: nuevas });
  };

  // 🔧 Eliminar patología
  const removePatologia = (index) => {
    const nuevas = [...formData.patologias];
    nuevas.splice(index, 1);
    setFormData({ ...formData, patologias: nuevas });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      // 1️⃣ Template ID (puedes usar "informe_eustasio" o lo que tengas)
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

          // Subir imágenes de cada patología
      formData.patologias.forEach((p, i) => {
        p.imagenes.forEach((file) => {
          fd.append(`patologia_${i}_images`, file);
        });
      });

      // 4️⃣ Llamada al backend
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        body: fd, // importante: no poner headers, FormData lo maneja
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
      a.download = "Informe.docx";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Error generando informe: " + err.message);
    }
  };



  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl mx-auto p-6 border rounded-lg shadow"
    >
      <h1 className="text-2xl font-bold">Inspección Técnica de Edificios</h1>

      {/* DATOS GENERALES */}
      <div>
        <h2 className="font-bold">Datos Generales</h2>
        <input
          type="text"
          placeholder="Título"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección Completa"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        />
        <input
          type="text"
          placeholder="Promotor"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, promotor: e.target.value })}
        />
        <h2 className="font-bold">Datos Generales</h2>
        <input
          type="text"
          placeholder="Arquitecta"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, arquitecta: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nº colegiada"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, nColegiada: e.target.value })}
        />
      
        <h3 className="block">Datos de la oferta</h3>
        <input
          type="text"
          placeholder="Nº de oferta"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, nOferta: e.target.value })}
        />
        <input
          type="date"         
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, fechaOferta: e.target.value })}
        />

        <h2 className="block">Datos del edificio</h2>
        <label className="block">Fecha de la visita</label>
        <input
          type="date"
          defaultValue={hoy}
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
        />
        <label className="block mt-4 mb-2">Foto Portada</label>
        <input
          type="file"
          accept="image/*"
          className="my-2"
          onChange={handleMainPhotoUpload}
        />
        {formData.previewFotoPortada && (
          <div className="mt-2">
            <img
              src={formData.previewFotoPortada}
              alt="Foto portada"
              className="w-40 h-40 object-cover rounded border"
            />
          </div>
        )}
        <label className="block mt-4 mb-2">Plano de emplazamiento</label>
        <input
          type="file"
          accept="image/*"
          className="my-2"
          onChange={handleSecondaryPhotoUpload}
        />
        {formData.previewFotoEmplazamiento && (
          <div className="mt-2">
            <img
              src={formData.previewFotoEmplazamiento}
              alt="Foto de emplazamiento"
              className="w-40 h-40 object-cover rounded border"
            />
          </div>
        )}
      </div>
    
      {/* <div>
        <input
          type="text"
          placeholder="nº de plantas"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, plantas: e.target.value })}
        />
        <input
          type="text"
          placeholder="nº de viviendas por planta"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, viviendas: e.target.value })}
        />
      </div>
 */}
      <div>
      <h3 className="font-bold">Emplazamiento y Colindantes</h3>
        <textarea
          placeholder="Emplazamiento y colindantes"
          defaultValue='La inspección a realizar se ha llevado a cabo en un edificio residencial ubicado en [dirección]. Se trata de un edificio de planta rectangular con un acceso enclavado entre edificios residenciales medianeros correspondientes a [colindantes]. El edificio se compone de planta sótano, baja, [plantas] plantas de vivienda con [viviendas] viviendas [trasteros...].'
          className="border p-2 w-full"
          rows="5"
          onChange={(e) => setFormData({ ...formData, emplazamiento: e.target.value })}
        />
      </div>
      <div>
         <label style={{ display: "block", marginBottom: "10px" }}>
        Tipología de estructura:
         <select
          name="tipologiaEstructura"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, tipologiaEstructura: e.target.value })}>
        
          <option value="">Selecciona...</option>
          <option value="Hormigón">Hormigón</option>
          <option value="Madera">Madera</option>
          <option value="Metálica">Metálica</option>
          <option value="Mixta">Mixta</option>
        </select>
      </label>

       <label style={{ display: "block", marginBottom: "10px" }}>
        Cerramientos (ej. ladrillo, bloque, etc.):
        <input
          type="text"
          name="cerramientos"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, cerramientos: e.target.value })}
          placeholder="Descripción de los cerramientos"
        />
      </label>

      <label style={{ display: "block", marginBottom: "10px" }}>
        Revestimiento exterior (ej. revoco, piedra):
        <input
          type="text"
          name="revestimientoExterior"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, revestimientoExterior: e.target.value })}
          placeholder="Tipo de revestimiento exterior"
        />
      </label>

      <label style={{ display: "block", marginBottom: "10px" }}>
        Tipo de cubierta:
        <select
          name="cubiertaTipo"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, cubiertaTipo: e.target.value })}
        >
          <option value="">Selecciona...</option>
          <option value="Inclinada dos aguas">Inclinada a dos aguas</option>
          <option value="Plana transitable">Plana transitable</option>
          <option value="Plana no transitable">Plana no transitable</option>
          <option value="Otro">Otro</option>
        </select>
      </label>

      <label style={{ display: "block", marginBottom: "10px" }}>
        Descripción de patios/interiores:
        <textarea
          name="patiosDescripcion"
          className="border p-2 w-full"
          
          placeholder="Descripción de patios, ventilación, iluminación...(opcional)"
          onChange={(e) => setFormData({ ...formData, patiosTipo: e.target.value })}
          />
        
      </label> 
    </div>

  
      {/* ANTECEDENTES */}
      <div>
        <h3 className="font-bold">Antecedentes</h3>
        <textarea
          placeholder="Motivo de la inspección"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, motivoInspeccion: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, fechaVisita: e.target.value })}
        />
        <textarea
          placeholder="Observaciones previas"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, observacionesPrevias: e.target.value })}
        />
      </div>

      {/* PATOLOGÍAS */}
      {/* 🔥 PATOLOGÍAS DINÁMICAS */}
      <div>
        <h3 className="font-bold">Patologías Detectadas</h3>

        {formData.patologias.map((pat, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <div className="flex justify-between items-center">
              <select
                className="border p-1 w-3/4"
                value={pat.tipo}
                onChange={(e) => updatePatologia(index, "tipo", e.target.value)}
              >
                <option value="">Selecciona tipo...</option>
                {tiposPatologias.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => removePatologia(index)}
              >
                Eliminar
              </button>
            </div>

            <input
              type="text"
              placeholder="Pisos afectados"
              className="border p-1 w-full my-1"
              value={pat.pisos}
              onChange={(e) => updatePatologia(index, "pisos", e.target.value)}
            />
            <textarea
              placeholder="Descripción"
              className="border p-1 w-full my-1"
              value={pat.descripcion}
              onChange={(e) => updatePatologia(index, "descripcion", e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Grado de actuación (1-5)"
              className="border p-1 w-full my-1"
              value={pat.grado}
              onChange={(e) => updatePatologia(index, "grado", e.target.value)}
            />

            <input
              type="file"
              multiple
              accept="image/*"
              className="my-2"
              onChange={(e) => handleImageUpload(index, e.target.files)}
            />
            <div className="flex gap-2 flex-wrap">
              {pat.preview.map((url, i) => (
                <img key={i} src={url} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded border" />
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          className="bg-gray-300 px-3 py-1 rounded mt-2"
          onClick={addPatologia}
        >
          + Añadir patología
        </button>
      </div>

      {/* CONCLUSIONES */}
      <div>
        <h3 className="font-bold">Conclusiones</h3>
        <textarea
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, conclusiones: e.target.value })}
        />
      </div>

      {/* ACTUACIONES */}
      <div>
        <h3 className="font-bold">Posibles Actuaciones</h3>
        {formData.actuaciones.map((act, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Actuación ${index + 1}`}
            className="border p-2 w-full my-1"
            value={act}
            onChange={(e) => updateActuacion(index, e.target.value)}
          />
        ))}
        <button
          type="button"
          className="bg-gray-300 px-3 py-1 rounded mt-2"
          onClick={addActuacion}
        >
          + Añadir actuación
        </button>
      </div>

      {/* PRESUPUESTO */}
      <div>
        <h3 className="font-bold">Presupuesto Preliminar</h3>
        {formData.presupuesto.map((partida, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 my-2">
            <input
              type="text"
              placeholder="Partida"
              className="border p-1"
              value={partida.partida}
              onChange={(e) => updatePartida(index, "partida", e.target.value)}
            />
            <input
              type="text"
              placeholder="Unidades"
              className="border p-1"
              value={partida.unidades}
              onChange={(e) => updatePartida(index, "unidades", e.target.value)}
            />
            <input
              type="number"
              placeholder="Precio unitario"
              className="border p-1"
              value={partida.precioUnitario}
              onChange={(e) => updatePartida(index, "precioUnitario", e.target.value)}
            />
            <input
              type="number"
              placeholder="Total"
              className="border p-1"
              value={partida.total}
              onChange={(e) => updatePartida(index, "total", e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          className="bg-gray-300 px-3 py-1 rounded"
          onClick={addPartida}
        >
          + Añadir partida
        </button>
      </div>

      {/* NOTAS */}
      <div>
        <h3 className="font-bold">Notas Finales</h3>
        <textarea
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Generar Informe
      </button>
    </form>
  );
}
