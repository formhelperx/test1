from docx import Document
from docx.shared import Inches, Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def crear_doc(template_file=None):
    if template_file:
        return Document(template_file.file)
    else:
        return Document("plantillas/estandar.docx")

def insertar_datos_generales(doc, data):
    doc.add_heading("Datos Generales", level=1)
    doc.add_paragraph(f"Dirección: {data.get('direccion','')}")
    doc.add_paragraph(f"Promotor: {data.get('promotor','')}")
    doc.add_paragraph(f"Arquitecta: {data.get('arquitecta','')}")
    doc.add_paragraph(f"Fecha: {data.get('fecha','')}")

def insertar_antecedentes(doc, data):
    if data.get("motivoInspeccion") or data.get("observacionesPrevias"):
        doc.add_heading("Antecedentes", level=1)
        if data.get("motivoInspeccion"):
            doc.add_paragraph(f"Motivo: {data['motivoInspeccion']}")
        if data.get("observacionesPrevias"):
            doc.add_paragraph(f"Observaciones: {data['observacionesPrevias']}")

def insertar_patologias(doc, data, images_map):
    for tipo, info in data.get("patologias", {}).items():
        if info.get("activo"):
            doc.add_heading(tipo.capitalize(), level=1)
            if info.get("pisos"):
                doc.add_paragraph(f"Pisos afectados: {info['pisos']}")
            if info.get("descripcion"):
                doc.add_paragraph(f"Descripción: {info['descripcion']}")
            if info.get("grado"):
                doc.add_paragraph(f"Grado de actuación: {info['grado']}")

            for img in images_map.get(tipo, []):
                run = doc.add_paragraph().add_run()
                run.add_picture(img.file, width=Inches(2))

def insertar_presupuesto(doc, presupuesto):
    if not presupuesto:
        return

    doc.add_heading("Presupuesto", level=1)
    table = doc.add_table(rows=1, cols=4)
    table.style = "Table Grid"

    hdr_cells = table.rows[0].cells
    headers = ["Partida", "Unidades", "Precio Unitario", "Total"]
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        run = hdr_cells[i].paragraphs[0].runs[0]
        run.bold = True
        run.font.size = Pt(11)

    for item in presupuesto:
        row = table.add_row().cells
        row[0].text = item.get("partida", "")
        row[1].text = str(item.get("unidades", ""))
        row[2].text = str(item.get("precioUnitario", ""))
        row[3].text = str(item.get("total", ""))

    # Opcional: bordes finos estilo PDF
    for row in table.rows:
        for cell in row.cells:
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_borders = OxmlElement('w:tcBorders')
            for border_name in ("top","left","bottom","right"):
                border_el = OxmlElement(f"w:{border_name}")
                border_el.set(qn('w:val'), 'single')
                border_el.set(qn('w:sz'), '4')
                border_el.set(qn('w:space'), '0')
                border_el.set(qn('w:color'), '000000')
                tc_borders.append(border_el)
            tc_pr.append(tc_borders)

def insertar_conclusiones(doc, data):
    if data.get("conclusiones"):
        doc.add_heading("Conclusiones", level=1)
        doc.add_paragraph(data["conclusiones"])

def insertar_notas(doc, data):
    if data.get("notas"):
        doc.add_heading("Notas", level=1)
        doc.add_paragraph(data["notas"])
