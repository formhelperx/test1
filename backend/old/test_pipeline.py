from pathlib import Path
import json
import pandas as pd
from word_generator import generate_report_from_excel

# ---- 1️⃣ Configuración de paths ----
TEMPLATES_DIR = Path("templates")
EXCEL_PATH = Path("test_input.xlsx")
OUTPUT_DOCX = Path("output_test.docx")
TEMPLATE_JSON = TEMPLATES_DIR / "report-template.json"

# ---- 2️⃣ Crear Excel de prueba ----
def create_test_excel(path: Path):
    # Metadata
    metadata = pd.DataFrame([{
        "project_name": "Proyecto Prueba",
        "doc_version": "v1.0",
        "doc_date": "2025-09-10"
    }])
    
    # Introducción
    intro = pd.DataFrame([{
        "introduction": "Este es un texto de prueba para la introducción del documento."
    }])
    
    # Tabla de riesgos
    risk_table = pd.DataFrame([
        {"id": "R-001", "description": "Fallo de prueba", "severity": "Alta", "mitigation": "Mitigación"},
        {"id": "R-002", "description": "Otro riesgo", "severity": "Media", "mitigation": "Mitigación opcional"}
    ])
    
    # Lista de acciones
    actions_list = pd.DataFrame([
        {"action": "Acción de prueba", "responsible": "Responsable", "deadline": "2025-09-20"}
    ])
    
    # Notas extra
    extra_notes = pd.DataFrame([{
        "extra_notes": "Notas adicionales de prueba"
    }])
    
    # Guardar en Excel
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        metadata.to_excel(writer, sheet_name="project_name", index=False)
        intro.to_excel(writer, sheet_name="introduction", index=False)
        risk_table.to_excel(writer, sheet_name="risk_table", index=False)
        actions_list.to_excel(writer, sheet_name="actions_list", index=False)
        extra_notes.to_excel(writer, sheet_name="extra_notes", index=False)

    print(f"✅ Excel de prueba generado en: {path}")

# ---- 3️⃣ Cargar template JSON ----
def load_template(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"No se encontró el template: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# ---- 4️⃣ Ejecutar flujo completo ----
if __name__ == "__main__":
    # Crear Excel de prueba
    create_test_excel(EXCEL_PATH)
    
    # Cargar template
    template_def = load_template(TEMPLATE_JSON)
    
    # Generar Word
    generate_report_from_excel(
        excel_path=str(EXCEL_PATH),
        template_def=template_def,
        output_path=str(OUTPUT_DOCX)
    )

    print(f"✅ Documento Word generado en: {OUTPUT_DOCX}")
