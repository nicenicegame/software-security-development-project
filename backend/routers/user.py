from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from typing import List

router = APIRouter()


@router.post(
    "/users/",
    # response_model=schemas.User,
    tags=["users"],
)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db=db, user=user)
    return new_user


@router.get(
    "/users/",
    # response_model=List[schemas.User],
    tags=["users"],
)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get(
    "/users/{user_id}",
    # response_model=schemas.User,
    tags=["users"],
)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post("/users/{user_id}/todos/", response_model=schemas.Todo, tags=["users"])
def create_item_for_user(
    user_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)
):
    return crud.create_user_todo(db=db, todo=todo, user_id=user_id)
