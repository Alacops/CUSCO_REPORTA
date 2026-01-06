from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scraper import buscar_dni

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # en producción se restringe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dni/{numero}")
def get_dni(numero: str):
    return buscar_dni(numero)

