from fastapi import FastAPI, Request
from .database import engine, Base
from .routers import nhankhau, hokhau, user, tamtrutamvang, khoanthu, noptien, lichsuhokhau
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
import logging
from time import time
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.access")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BlueMoon Apartment Management")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    log_data = {
        "request_path": request.url.path,
        "http_method": request.method,
        "response_code": response.status_code,
    }
    logger.info(json.dumps(log_data))
    return response

app.include_router(user.router)
app.include_router(nhankhau.router)
app.include_router(hokhau.router)
app.include_router(tamtrutamvang.router)
app.include_router(khoanthu.router)
app.include_router(noptien.router)
app.include_router(lichsuhokhau.router)
Instrumentator().instrument(app).expose(app)