import React, { useState } from "react";
import ExcelUploader from "./components/ExcelUploader";

export default function ExcelTemplate() {
  const [file, setFile] = useState(null);

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Por favor sube un archivo Excel primero.");
      return;
    }

    // TODO: enviar al backend con FormData
    alert("Excel listo para procesar: " + file.name);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Generar informe desde Excel</h2>
      <ExcelUploader onFileSelected={handleFileSelected} />
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Procesar Excel
      </button>
    </div>
  );
}
