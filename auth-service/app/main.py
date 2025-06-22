import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from passlib.apache import HtpasswdFile
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
security = HTTPBasic()

auth_admin = os.getenv("AUTH_ADMIN")
auth_user = os.getenv("AUTH_USER")

ht_file_content = ""
roles = {}

if auth_admin:
    username, hash_ = auth_admin.split(":", 1)
    ht_file_content += f"{username}:{hash_}\n"
    roles[username] = "admin"

if auth_user:
    username, hash_ = auth_user.split(":", 1)
    ht_file_content += f"{username}:{hash_}\n"
    roles[username] = "user"

htpasswd = HtpasswdFile.from_string(ht_file_content)

@app.api_route("/auth", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
async def auth(request: Request):
    try:
        credentials: HTTPBasicCredentials = await security(request)
    except Exception:
        return JSONResponse(status_code=403, content={"detail": "Missing or invalid auth"})

    username = credentials.username
    password = credentials.password

    if not htpasswd.check_password(username, password):
        return JSONResponse(status_code=403, content={"detail": "Invalid credentials"})

    role = roles.get(username, "user")
    method = request.headers.get("X-Original-Method", request.method).upper()

    if role == "user" and method in ["POST", "DELETE"]:
        return JSONResponse(status_code=403, content={"detail": "Insufficient permission"})

    return Response(status_code=200)

Instrumentator().instrument(app).expose(app)