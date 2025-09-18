import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">Word Form Generator</h1>
      <p className="text-gray-700 mb-8 text-center">
        Elige cómo quieres crear tu documento:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/form-template")}
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-lg font-bold mb-2">📝 Rellenar Formulario</h3>
          <p className="text-gray-600 text-sm">
            Completa un formulario dinámico para generar tu informe.
          </p>
        </button>

        <button
          onClick={() => navigate("/excel-template")}
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-lg font-bold mb-2">📊 Subir Excel</h3>
          <p className="text-gray-600 text-sm">
            Sube un Excel y selecciona las hojas/columnas para tu informe.
          </p>
        </button>

        <button
          onClick={() => navigate("/ITEForm")}
          className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-lg font-bold mb-2">📝 Rellenar Formulario ITE</h3>
          <p className="text-gray-600 text-sm">
            Sube un Excel y selecciona las hojas/columnas para tu informe.
          </p>
        </button>

        <button
          disabled
          className="p-6 bg-gray-200 text-gray-500 shadow rounded-xl cursor-not-allowed border border-gray-200"
        >
          <h3 className="text-lg font-bold mb-2">➕ Otro Método</h3>
          <p className="text-gray-500 text-sm">Próximamente disponible</p>
        </button>
      </div>
    </div>
  );
}
