// src/api.js

//const BASE_URL = "http://localhost:8000";

//const VITE_API_URL = "https://test1-w6gt.onrender.com";// en environment variables;
const API_URL = import.meta.env.VITE_API_URL;

// Wrapper para fetch con manejo básico de errores
export async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("❌ API error:", err);
    throw err;
  }
}

// Ejemplo de endpoints -----------------------------

export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error("Error en health check");
  return res.json();
}


export async function getSomething() {
  return apiFetch("/something");
}

export async function postSomething(data) {
  return apiFetch("/something", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadExcel(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload-excel/`, {
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

  const res = await fetch(`${API_URL}/get-columns/`, {
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

  const res = await fetch(`${API_URL}/map-columns/`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Error al mapear las columnas.");
  }

  return await res.json();
}

export async function generateWord(templateId, formData) {
  const fd = new FormData();
  fd.append("template_id", templateId);
  fd.append("form_data", JSON.stringify(formData));

  if (formData.fotoPrincipal) {
    fd.append("foto_portada", formData.fotoPrincipal);
  }
  if (formData.fotoEmplazamiento) {
    fd.append("foto_emplazamiento", formData.fotoEmplazamiento);
  }

  // Recorrer todas las patologías y enviar los archivos reales
  Object.entries(formData.patologias).forEach(([tipo, patologia]) => {
    patologia.imagenes.forEach((file, index) => {
      // file es un File real si viene de <input type="file">
      fd.append(`${tipo}_images`, file); 
    });
  });

  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) throw new Error("Error generating Word");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Informe.docx";
  a.click();
}
