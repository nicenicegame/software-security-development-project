from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.utils.oauth2 import get_current_admin
from .. import crud, models, schemas
from ..database import get_db
from typing import List

router = APIRouter()


@router.get("/todos/", response_model=List[schemas.Todo],)
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_admin)):
    print(f"Current admin {current_user}")
    todos = crud.get_todos(db, skip=skip, limit=limit)
    return todos
