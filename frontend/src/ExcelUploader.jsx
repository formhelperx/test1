// src/components/ExcelUploader.jsx

import React, { useState } from "react";
import { uploadExcel, getColumnsFromSheet, mapExcelColumns } from "./api";

function ExcelUploader() {
  const [filePath, setFilePath] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const data = await uploadExcel(file);
      setSheets(data.sheets);
      setFilePath(data.file_path);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSheet = async (sheet) => {
    setLoading(true);
    setError(null);
    setSelectedSheet(sheet);
    try {
      const data = await getColumnsFromSheet(filePath, sheet);
      setColumns(data.columns);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (col, value) => {
    setMapping({ ...mapping, [col]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mapExcelColumns(filePath, selectedSheet, mapping);
      alert("Mapeo guardado con éxito: " + JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Subir Archivo Excel</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-blue-500 mb-4">Cargando...</div>}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Selecciona un archivo:</label>
        <input type="file" onChange={handleUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {sheets.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Selecciona la hoja:</h3>
          <div className="flex gap-2">
            {sheets.map((s) => (
              <button
                key={s}
                onClick={() => handleSelectSheet(s)}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${selectedSheet === s ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {columns.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Mapea las columnas:</h3>
          <div className="space-y-2">
            {columns.map((col) => (
              <div key={col} className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-600 w-1/3">{col}</span>
                <span className="text-gray-500">→</span>
                <input
                  type="text"
                  placeholder="{CAMPO}"
                  onChange={(e) => handleMappingChange(col, e.target.value)}
                  className="w-2/3 p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Guardar Mapeo
          </button>
        </div>
      )}
    </div>
  );
}

export default ExcelUploader;