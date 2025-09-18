import React, { useState } from "react";

export default function ITEForm() {
  const [formData, setFormData] = useState({
    direccion: "",
    promotor: "",
    arquitecta: "",
    fecha: "",

    motivoInspeccion: "",
    fechaVisita: "",
    observacionesPrevias: "",

    patologias: {
      fisuras: { activo: false, pisos: "", descripcion: "", grado: 0, imagenes: [] },
      desconches: { activo: false, pisos: "", descripcion: "", grado: 0, imagenes: [] },
      humedades: { activo: false, pisos: "", descripcion: "", grado: 0, imagenes: [] },
      barandillas: { activo: false, pisos: "", descripcion: "", grado: 0, imagenes: [] },
      gresite: { activo: false, pisos: "", descripcion: "", grado: 0, imagenes: [] },
      lucernarios: { activo: false, descripcion: "", grado: 0, imagenes: [] },
      balcones: { activo: false, descripcion: "", grado: 0, imagenes: [] },
      instalaciones: { activo: false, descripcion: "", grado: 0, imagenes: [] },
      patios: { activo: false, descripcion: "", grado: 0, imagenes: [] },
    },

    conclusiones: "",
    actuaciones: [],
    presupuesto: [{ partida: "", unidades: "", precioUnitario: "", total: "" }],
    notas: "",
  });

  // Helper para actualizar campos simples
  const handleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value },
    });
  };

  // Helper para actualizar patologías
  const handlePatologiaChange = (tipo, field, value) => {
    setFormData({
      ...formData,
      patologias: {
        ...formData.patologias,
        [tipo]: { ...formData.patologias[tipo], [field]: value },
      },
    });
  };

  // Subida de imágenes
  const handleImageUpload = (tipo, files) => {
    const imagenesArray = Array.from(files).map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      patologias: {
        ...formData.patologias,
        [tipo]: {
          ...formData.patologias[tipo],
          imagenes: [...formData.patologias[tipo].imagenes, ...imagenesArray],
        },
      },
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await generateWord("informe_eustasio", formData, imagenesPorPatologia);
    } catch (err) {
      console.error(err);
      alert("Error generando informe");
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl mx-auto p-6 border rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold">Informe Técnico – Eustasio Amilibia</h2>

      {/* DATOS GENERALES */}
      <div>
        <h3 className="font-bold">Datos Generales</h3>
        <input
          type="text"
          placeholder="Dirección"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        />
        <input
          type="text"
          placeholder="Promotor"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, promotor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Arquitecta"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, arquitecta: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
        />
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
      <div>
        <h3 className="font-bold">Patologías Detectadas</h3>
        {Object.keys(formData.patologias).map((tipo) => (
          <div key={tipo} className="border p-3 rounded mb-3">
            <label className="font-semibold capitalize">
              <input
                type="checkbox"
                checked={formData.patologias[tipo].activo}
                onChange={(e) =>
                  handlePatologiaChange(tipo, "activo", e.target.checked)
                }
              />{" "}
              {tipo}
            </label>

            {formData.patologias[tipo].activo && (
              <>
                <input
                  type="text"
                  placeholder="Pisos afectados"
                  className="border p-1 w-full my-1"
                  onChange={(e) =>
                    handlePatologiaChange(tipo, "pisos", e.target.value)
                  }
                />
                <textarea
                  placeholder="Descripción"
                  className="border p-1 w-full my-1"
                  onChange={(e) =>
                    handlePatologiaChange(tipo, "descripcion", e.target.value)
                  }
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Grado de actuación (1-5)"
                  className="border p-1 w-full my-1"
                  onChange={(e) =>
                    handlePatologiaChange(tipo, "grado", e.target.value)
                  }
                />

                {/* SUBIDA DE IMÁGENES */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="my-2"
                  onChange={(e) => handleImageUpload(tipo, e.target.files)}
                />
                <div className="flex gap-2 flex-wrap">
                  {formData.patologias[tipo].imagenes.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`preview-${i}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
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
