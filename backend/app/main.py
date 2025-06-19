from fastapi import FastAPI
from .database import engine, Base
from .routers import nhankhau, hokhau, user, tamtrutamvang, khoanthu, noptien, lichsuhokhau
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BlueMoon Apartment Management")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(nhankhau.router)
app.include_router(hokhau.router)
app.include_router(tamtrutamvang.router)
app.include_router(khoanthu.router)
app.include_router(noptien.router)
app.include_router(lichsuhokhau.router)
Instrumentator().instrument(app).expose(app)