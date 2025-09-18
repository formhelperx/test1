@echo off 
cd /d "C:\Users\16145\OneDrive - CAF\Documentos\Personal\Formaci¢n\FormHelper\word-form-generator\backend" 
if not exist venv python -m venv venv 
call venv\Scripts\activate 
pip install fastapi uvicorn python-docx 
uvicorn main:app --reload 
pause 
