import pandas as pd

def generate_test_excel(path="test_input.xlsx"):
    # ---- Metadata ----
    # (estos campos se manejarían normalmente como texto, aquí los dejamos de ejemplo en DataFrame)
    metadata = pd.DataFrame([{
        "project_name": "Proyecto Tren Seguros",
        "doc_version": "v1.2",
        "doc_date": "2025-09-08"
    }])

    # ---- Introduction ----
    intro = pd.DataFrame([{
        "introduction": "Este informe documenta los hallazgos de seguridad funcional \
y las medidas de mitigación propuestas durante la fase de validación."
    }])

    # ---- Risk Table ----
    risk_table = pd.DataFrame([
        {"id": "R-001", "description": "Fallo en freno de estacionamiento", "severity": "Alta", "mitigation": "Revisión periódica y redundancia"},
        {"id": "R-002", "description": "Puerta no se cierra correctamente", "severity": "Media", "mitigation": "Sensor redundante y bloqueo automático"},
        {"id": "R-003", "description": "Sobrecarga del sistema eléctrico", "severity": "Alta", "mitigation": "Protección mediante disyuntores"}
    ])

    # ---- Actions List ----
    actions_list = pd.DataFrame([
        {"action": "Actualizar firmware de control de freno", "responsible": "Ingeniería SW", "deadline": "2025-09-15"},
        {"action": "Revisar sensores de puerta", "responsible": "Mantenimiento", "deadline": "2025-09-20"},
        {"action": "Verificar dimensionamiento del sistema eléctrico", "responsible": "Ingeniería eléctrica", "deadline": "2025-09-25"}
    ])

    # ---- Comments ----
    comments = pd.DataFrame([{
        "extra_notes": "El análisis completo debe revisarse con el cliente antes de cierre del Q3."
    }])

    # Guardar en Excel con varias hojas
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        metadata.to_excel(writer, sheet_name="project_name", index=False)
        intro.to_excel(writer, sheet_name="introduction", index=False)
        risk_table.to_excel(writer, sheet_name="risk_table", index=False)
        actions_list.to_excel(writer, sheet_name="actions_list", index=False)
        comments.to_excel(writer, sheet_name="extra_notes", index=False)

    print(f"✅ Archivo Excel de prueba generado en: {path}")


if __name__ == "__main__":
    generate_test_excel()
