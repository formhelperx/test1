from fastapi import FastAPI, HTTPException, FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import tempfile, json, os
from typing import List, Dict
from fastapi.responses import FileResponse
from docx import Document
import tempfile
from document_builder import (
    crear_doc,
    #insertar_datos_generales,
    insertar_antecedentes,
    #insertar_patologias,
    insertar_memoria_descriptiva,
    insertar_resultados,
    insertar_presupuesto,
    insertar_conclusiones,
    insertar_notas,
    insertar_posibles_actuaciones
)

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción, cambia por la URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 2. Excel Uploader

@app.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    # Guardamos ruta en sesión/memoria para posteriores consultas
    return {"sheets": pd.ExcelFile(file_path).sheet_names, "file_path": file_path}

@app.post("/get-columns/")
async def get_columns(file_path: str = Form(...), sheet_name: str = Form(...)):
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    return {"columns": list(df.columns)}

@app.post("/map-columns/")
async def map_columns(file_path: str = Form(...), sheet_name: str = Form(...), mapping: str = Form(...)):
    import json
    mapping_dict: Dict[str, str] = json.loads(mapping)
    df = pd.read_excel(file_path, sheet_name=sheet_name)

    # Transformamos en estructura lista de diccionarios
    data = df.to_dict(orient="records")

    # Aquí conectarías con tu word_generator.py para reemplazar {CAMPOS} en plantilla
    return {"status": "ok", "rows": len(data), "mapped_fields": mapping_dict}




# 3. ITEForm
from fastapi import Form, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse

@app.post("/generate")
async def generate_word(
    template_id: str = Form(...),
    form_data: str = Form(...),
    fisuras_images: list[UploadFile] = File(default=[]),
    humedades_images: list[UploadFile] = File(default=[]),
    barandillas_images: list[UploadFile] = File(default=[]),
    gresite_images: list[UploadFile] = File(default=[]),
    lucernarios_images: list[UploadFile] = File(default=[]),
):
    try:
        data = json.loads(form_data)
        # Usar plantilla estándar si no hay template_file
        doc = crear_doc()

        # Construcción modular
        insertar_memoria_descriptiva(doc, data)
        insertar_antecedentes(doc, data)

        images_map = {
            "fisuras": fisuras_images,
            "humedades": humedades_images,
            "barandillas": barandillas_images,
            "gresite": gresite_images,
            "lucernarios": lucernarios_images,
        }
        insertar_resultados(doc, data, images_map)
        insertar_conclusiones(doc, data)
        insertar_posibles_actuaciones(doc, data)
        insertar_presupuesto(doc, data.get("presupuesto", []))
        insertar_notas(doc, data)

        out_path = tempfile.NamedTemporaryFile(delete=False, suffix=".docx").name
        doc.save(out_path)

        return FileResponse(
            out_path,
            filename="Informe.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
