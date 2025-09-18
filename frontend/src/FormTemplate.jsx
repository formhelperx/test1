import React, { useState } from "react";

export default function FormTemplate() {
  const [formData, setFormData] = useState({
    proyecto: "",
    cliente: "",
    fecha: "",
    // Fases
    demoliciones: { activo: false, metros: 0, precio: 0 },
    albanileria: { activo: false, tabiques: 0, precioTabique: 0, revestimientos: "" },
    instalaciones: {
      activo: false,
      electrica: { activo: false, potencia: 0, precio: 0 },
      fontaneria: { activo: false, puntos: 0, precio: 0 },
      clima: { activo: false, equipos: 0, precio: 0 }
    },
    carpinteria: {
      activo: false,
      puertas: { cantidad: 0, precio: 0 },
      ventanas: { cantidad: 0, precio: 0, material: "" },
      armarios: { activo: false, ml: 0, precio: 0 }
    },
    acabados: {
      activo: false,
      pintura: { m2: 0, color: "", precio: 0 },
      suelo: { m2: 0, tipo: "", precio: 0 }
    },
    // Variantes
    variantes: { puertas: "", suelo: "", ventanas: "" },
    // Cronograma
    cronograma: { demoliciones:  0, albanileria:  0, instalaciones:  0, carpinteria:  0, acabados:  0 },
    // Notas
    notas: ""
  });

  // helper
  const handleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/generar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Presupuesto.zip";
    a.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold">Generar Presupuesto Completo</h2>

      {/* DATOS GENERALES */}
      <div>
        <h3 className="font-bold">Datos Generales</h3>
        <label>Proyecto</label>
        <input type="text" onChange={(e)=>setFormData({...formData, proyecto:e.target.value})} className="border p-2 w-full"/>
        <label>Cliente</label>
        <input type="text" onChange={(e)=>setFormData({...formData, cliente:e.target.value})} className="border p-2 w-full"/>
        <label>Fecha</label>
        <input type="date" onChange={(e)=>setFormData({...formData, fecha:e.target.value})} className="border p-2 w-full"/>
      </div>

      {/* DEMOLICIONES */}
      <div>
        <h3 className="font-bold">Demoliciones</h3>
        
          <input type="checkbox"
            checked={formData.demoliciones.activo}
            onChange={(e)=>handleChange("demoliciones","activo",e.target.checked)}/>
        <label>Incluir</label>
        
        {formData.demoliciones.activo && (
          <>
            <label>Metros cuadrados</label>
            <input type="number" onChange={(e)=>handleChange("demoliciones","metros",e.target.value)} className="border p-2 w-full"/>
            <label>Precio por m²</label>
            <input type="number" onChange={(e)=>handleChange("demoliciones","precio",e.target.value)} className="border p-2 w-full"/>
          </>
        )}
      </div>

      {/* ALBAÑILERÍA */}
      <div>
        <h3 className="font-bold">Albañilería</h3>
        <label>
          <input type="checkbox"
            checked={formData.albanileria.activo}
            onChange={(e)=>handleChange("albanileria","activo",e.target.checked)}/>
          <label>Incluir</label>
        </label>
        {formData.albanileria.activo && (
          <>
            <label>Tabiques interiores (cantidad)</label>
            <input type="number" onChange={(e)=>handleChange("albanileria","tabiques",e.target.value)} className="border p-2 w-full"/>
            <label>Precio por tabique (€)</label>
            <input type="number" onChange={(e)=>handleChange("albanileria","precioTabique",e.target.value)} className="border p-2 w-full"/>
            <label>Revestimiento</label>
            <select onChange={(e)=>handleChange("albanileria","revestimientos",e.target.value)}>
              <option value="">Seleccione</option>
              <option value="yeso">Yeso</option>
              <option value="pladur">Pladur</option>
              <option value="ladrillo">Ladrillo</option>
            </select>
          </>
        )}
      </div>

      {/* INSTALACIONES */}
      <div>
        <h3 className="font-bold">Instalaciones</h3>
        <label>
          <input type="checkbox"
            checked={formData.instalaciones.activo}
            onChange={(e)=>handleChange("instalaciones","activo",e.target.checked)}/>
          Incluir
        </label>
        {formData.instalaciones.activo && (
          <>
            <label>
              <input type="checkbox"
                checked={formData.instalaciones.electrica.activo}
                onChange={(e)=>setFormData({
                  ...formData,
                  instalaciones: {...formData.instalaciones, electrica: {...formData.instalaciones.electrica, activo: e.target.checked}}
                })}/>
              Eléctrica
            </label>
            {formData.instalaciones.electrica.activo && (
              <>
                <label>Potencia (kW)</label>
                <input type="number"
                  onChange={(e)=>setFormData({...formData,
                    instalaciones: {...formData.instalaciones,
                      electrica: {...formData.instalaciones.electrica, potencia:e.target.value}}})}/>
                <label>Precio</label>
                <input type="number"
                  onChange={(e)=>setFormData({...formData,
                    instalaciones: {...formData.instalaciones,
                      electrica: {...formData.instalaciones.electrica, precio:e.target.value}}})}/>
              </>
            )}
            {/* Similar para fontanería y climatización */}
          </>
        )}
      </div>

      {/* CARPINTERÍA */}
      <div>
        <h3 className="font-bold">Carpintería</h3>
        <label>
          <input type="checkbox"
            checked={formData.carpinteria.activo}
            onChange={(e)=>handleChange("carpinteria","activo",e.target.checked)}/>
          Incluir
        </label>
        {formData.carpinteria.activo && (
          <>
            <label>Número de puertas</label>
            <input type="number" onChange={(e)=>setFormData({
              ...formData,
              carpinteria: {...formData.carpinteria, puertas:{...formData.carpinteria.puertas, cantidad:e.target.value}}
            })}/>
            <label>Precio por puerta</label>
            <input type="number" onChange={(e)=>setFormData({
              ...formData,
              carpinteria: {...formData.carpinteria, puertas:{...formData.carpinteria.puertas, precio:e.target.value}}
            })}/>
            <label>Número de ventanas</label>
            <input type="number" onChange={(e)=>setFormData({
              ...formData,
              carpinteria: {...formData.carpinteria, ventanas:{...formData.carpinteria.ventanas, cantidad:e.target.value}}
            })}/>
            <label>Material ventana</label>
            <select onChange={(e)=>setFormData({
              ...formData,
              carpinteria: {...formData.carpinteria, ventanas:{...formData.carpinteria.ventanas, material:e.target.value}}
            })}>
              <option value="">Seleccione</option>
              <option value="aluminio">Aluminio</option>
              <option value="madera">Madera</option>
              <option value="pvc">PVC</option>
            </select>
          </>
        )}
      </div>

      {/* ACABADOS */}
      <div>
        <h3 className="font-bold">Acabados</h3>
        <label>
          <input type="checkbox"
            checked={formData.acabados.activo}
            onChange={(e)=>handleChange("acabados","activo",e.target.checked)}/>
          Incluir
        </label>
        {formData.acabados.activo && (
          <>
            <label>Pintura (m²)</label>
            <input type="number" onChange={(e)=>setFormData({
              ...formData,
              acabados: {...formData.acabados, pintura:{...formData.acabados.pintura, m2:e.target.value}}
            })}/>
            <label>Color</label>
            <input type="text" onChange={(e)=>setFormData({
              ...formData,
              acabados: {...formData.acabados, pintura:{...formData.acabados.pintura, color:e.target.value}}
            })}/>
          </>
        )}
      </div>

      {/* VARIANTES */}
      <div>
        <h3 className="font-bold">Opciones / Variantes</h3>
        <label>Puertas</label>
        <input type="text" onChange={(e)=>setFormData({...formData, variantes:{...formData.variantes, puertas:e.target.value}})}/>
        <label>Suelo</label>
        <input type="text" onChange={(e)=>setFormData({...formData, variantes:{...formData.variantes, suelo:e.target.value}})}/>
        <label>Ventanas</label>
        <input type="text" onChange={(e)=>setFormData({...formData, variantes:{...formData.variantes, ventanas:e.target.value}})}/>
      </div>

      {/* CRONOGRAMA */}
      <div>
        <h3 className="font-bold">Cronograma (semanas)</h3>
        {Object.keys(formData.cronograma).map(fase=>(
          <div key={fase}>
            <label>{fase}</label>
            <input type="number"
              value={formData.cronograma[fase]}
              onChange={(e)=>setFormData({
                ...formData,
                cronograma:{...formData.cronograma, [fase]:e.target.value}
              })}/>
          </div>
        ))}
      </div>

      {/* NOTAS */}
      <div>
        <h3 className="font-bold">Notas / Condiciones</h3>
        <textarea
          onChange={(e)=>setFormData({...formData, notas:e.target.value})}
          className="border p-2 w-full"></textarea>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
        Generar Excel + Word
      </button>
    </form>
  );
}