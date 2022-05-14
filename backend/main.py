from fastapi import FastAPI

from . import models
from .database import engine
from .routers import todo, user, auth
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router, prefix="/api")
app.include_router(todo.router, prefix="/api")
app.include_router(auth.router)

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
