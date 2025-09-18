// src/api.js

const BASE_URL = "http://localhost:8000";

export async function uploadExcel(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload-excel/`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al subir el archivo.");
  }

  return await res.json();
}

export async function getColumnsFromSheet(filePath, sheetName) {
  const formData = new FormData();
  formData.append("file_path", filePath);
  formData.append("sheet_name", sheetName);

  const res = await fetch(`${BASE_URL}/get-columns/`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al obtener las columnas.");
  }

  return await res.json();
}

export async function mapExcelColumns(filePath, sheetName, mapping) {
  const formData = new FormData();
  formData.append("file_path", filePath);
  formData.append("sheet_name", sheetName);
  formData.append("mapping", JSON.stringify(mapping));

  const res = await fetch(`${BASE_URL}/map-columns/`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al mapear las columnas.");
  }

  return await res.json();
}

export async function generateWord(templateId, formData, imagenesPorPatologia = {}) {
  const fd = new FormData();

  // Template ID (texto plano)
  fd.append("template_id", templateId);

  // Datos del formulario como JSON
  fd.append("form_data", JSON.stringify(formData));

  // Añadir imágenes por patología
  Object.entries(imagenesPorPatologia).forEach(([tipo, files]) => {
    files.forEach((file) => {
      // campo se llamará p.ej. fisuras_images
      fd.append(`${tipo}_images`, file);
    });
  });

  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    body: fd, // <-- importante: no headers Content-Type
  });

  if (!res.ok) throw new Error("Error generating Word");

  // Aquí, como el backend devuelve un Word (.docx), no se parsea como JSON
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Informe.docx";
  a.click();
}