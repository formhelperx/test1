import json
import pandas as pd
from pathlib import Path
from word_generator import generate_report_from_excel as generate_word_report



TEMPLATES_DIR = Path("templates")


def load_template(template_id: str) -> dict:
    """
    Carga un template (JSON) desde templates por su nombre.
    Ejemplo: load_template("safety-report-v2") -> carga safety-report-v2.json
    """
    template_path = TEMPLATES_DIR / f"{template_id}.json"
    if not template_path.exists():
        raise FileNotFoundError(f"No se encontró la plantilla: {template_path}")
    with open(template_path, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_from_form(template_id: str, form_data: dict, output_path: str) -> str:
    """
    Convierte los datos del formulario en un Excel temporal y llama al generador Word.
    """
    template = load_template(template_id)

    # Crear un Excel temporal a partir del form_data
    temp_excel = Path("temp/temp_form_data.xlsx")
    with pd.ExcelWriter(temp_excel, engine="openpyxl") as writer:
        for key, value in form_data.items():
            # Si es tabla, convertir a DataFrame; si no, a DataFrame de una sola celda
            if isinstance(value, list):
                df = pd.DataFrame(value)
            else:
                df = pd.DataFrame([[value]], columns=[key])
            df.to_excel(writer, sheet_name=key, index=False)

    # Llamar al generador genérico
    generate_word_report(
        template_path=str(TEMPLATES_DIR / f"{template_id}.json"),
        excel_path=str(temp_excel),
        output_path=output_path,
    )

    return output_path
