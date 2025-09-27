import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import FormTemplate from "./FormTemplate";
import ExcelUploader from "./ExcelUploader";
import ITEForm from "./ITEForm";
import { healthCheck } from "./api";

function App() {
  useEffect(() => {
    healthCheck()
      .then((data) => console.log("✅ Backend conectado:", data))
      .catch((err) => console.error("❌ Error de conexión con backend:", err));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<Home />} />

          {/* Flujos de generación */}
          <Route path="/form-template" element={<FormTemplate />} />
          <Route path="/excel-template" element={<ExcelUploader />} />
          <Route path="/ITEForm" element={<ITEForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
