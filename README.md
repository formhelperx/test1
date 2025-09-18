# Word Form Generator

Proyecto para generar documentos Word dinámicos desde un formulario web.  
Frontend en React + Vite, Backend en FastAPI.

---

## Estructura del proyecto

```
word-form-generator/
├── backend/
│   ├── main.py          # FastAPI backend, maneja las peticiones y genera los documentos
│   ├── templates/       # Carpeta opcional con plantillas .docx
│   └── venv/            # Entorno virtual Python(como una "caja de herramientas" separada)
└── frontend/
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── api.js            ✅ todas las llamadas al backend
        ├── main.jsx
        ├── index.css
        ├── Home.jsx          ✅ selector de flujo
        ├── FormTemplate.jsx  ✅ formulario genérico
        └── ExcelTemplate.jsx ✅ subida + selección + mapeo Excel

```

---

## Paso 1️⃣ Backend (FastAPI)

### Crear y activar entorno virtual

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate

### Instalar dependencias
pip install fastapi uvicorn python-docx

### Ejecutar servidor
uvicorn main:app --reload 

```
El backend estará disponible en:  
```
http://127.0.0.1:8000
```

### Endpoints disponibles, para comunicar frontend con backend
- `GET /api/templates` → Lista de templates disponibles
- `GET /api/templates/{template_id}` → Información del template (campos, tipos)
- `POST /api/generate` → Genera un Word a partir de los datos del formulario

⚠️ Asegúrate de tener habilitado **CORS** si el frontend está en otro puerto.

---

## Paso 2️⃣ Frontend (React + Vite)
En otra terminal!
### Instalar dependencias
```bash
cd frontend
npm install
npm install @vitejs/plugin-react --save-dev
```
### Ejecutar servidor de desarrollo
```bash
npm run dev
```

Abre el navegador en:  
```
http://localhost:5173
```

---

## 3️⃣ Flujo de uso

1. Selecciona un template en el desplegable.  
2. Rellena los campos del formulario (dinámicos según el template).  
3. Pulsa **Generar Word** → se descargará un `.docx` generado dinámicamente.  

> Asegúrate de que **backend y frontend estén corriendo al mismo tiempo**.

---

## 4️⃣ Consejos

- Todos los campos del template son dinámicos: soportan `text`, `textarea`, `checkbox`, `select`.  
- Puedes agregar nuevos templates modificando `TEMPLATES` en `backend/main.py`.  
- Revisa la consola del navegador y la terminal para ver errores o logs de generación.  
- Para producción, restringe `CORS` a la URL del frontend en lugar de usar `"*"`.

volución a futuro

Unificación de inputs (formulario y Excel)

En el backend tendremos un modelo de plantilla que define todas las variables ({CLIENTE}, {PROYECTO}, {VENTAS}, etc.).

El frontend podrá rellenar esas variables:

vía formulario (manual)

vía Excel (mappeando columnas)

Así el cliente decide la entrada, pero el resultado es el mismo → un set de variables listo para escribir en Word.

Personalización de formulario por proyecto

Se podría definir un JSON de plantilla de formulario con los campos que quieres mostrar.

Ejemplo:

{
  "fields": [
    { "name": "cliente", "label": "Cliente", "type": "text" },
    { "name": "ventas", "label": "Ventas", "type": "number" },
    { "name": "fecha", "label": "Fecha", "type": "date" }
  ]
}


El frontend leería esto y renderizaría el formulario dinámicamente.

Ese mismo JSON también serviría para mappear las columnas de Excel → variables comunes.