from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from PIL import Image, ImageDraw
import numpy as np
import cv2
import os
import shutil
import io

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def main(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_location = f"static/uploads/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"file_url": f"/static/uploads/{file.filename}"}

@app.post("/analyze/")
async def analyze_image(file_url: str = Form(...)):
    file_path = file_url.replace("/static/", "")
    image_path = os.path.join("static", file_path)
    analyzed_image_path = os.path.join("static/analyzed", os.path.basename(image_path))

    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    # Simulate object detection with a box in the center
    width, height = image.size
    draw.rectangle([(width * 0.25, height * 0.25), (width * 0.75, height * 0.75)], outline="red", width=5)
    image.save(analyzed_image_path)
    
    return {"analyzed_image_url": f"/static/analyzed/{os.path.basename(image_path)}"}

# Serve static files directly
@app.get("/static/uploads/{file_path:path}")
async def get_uploaded_file(file_path: str):
    return FileResponse(path=os.path.join("static/uploads", file_path))

@app.get("/static/analyzed/{file_path:path}")
async def get_analyzed_file(file_path: str):
    return FileResponse(path=os.path.join("static/analyzed", file_path))

if __name__ == "__main__":
    if not os.path.exists("static/uploads"):
        os.makedirs("static/uploads")
    if not os.path.exists("static/analyzed"):
        os.makedirs("static/analyzed")
    import uvicorn
    uvicorn.run(app, host="localhost", port=8080)