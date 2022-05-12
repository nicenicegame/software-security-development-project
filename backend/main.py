from fastapi import FastAPI

from . import crud, models, schemas
from .database import engine
from .routers import todo, user, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router, prefix="/api")
app.include_router(todo.router, prefix="/api")
app.include_router(auth.router)
