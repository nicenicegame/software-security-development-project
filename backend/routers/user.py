from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from backend.utils.oauth2 import get_current_user
from .. import crud, models, schemas
from ..database import get_db
from typing import List
from fastapi_utils.guid_type import GUID

router = APIRouter()


@router.get(
    "/users/",
    # response_model=List[schemas.User],
    tags=["users"],
)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get(
    "/user/{user_id}",
    # response_model=schemas.User,
    tags=["users"],
)
def read_user(user_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user) ):
    print(current_user)
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_todos = crud.get_user_todos(db, user_id=user_id, skip=0, limit=0)
    return {"users": db_user, "todos": db_todos}


@router.post("/user/{user_id}/todos/", response_model=schemas.Todo, tags=["users"])
def create_item_for_user(
    user_id: str, todo: schemas.TodoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return crud.create_user_todo(db=db, todo=todo, user_id=user_id)


@router.put(
    "/user/{user_id}/todos/{todo_id}",
    # response_model=schemas.Todo,
    tags=["users"],
)
def update_todos_for_user(
    user_id: str, todo_id, new_todo: schemas.Todo, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return crud.update_user_todo(db=db, todo_id=todo_id, user_id=user_id, todo=new_todo)


@router.delete("/user/{user_id}/todos/{todo_id}", tags=["users"])
def delete_todos_for_user(user_id: str, todo_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.delete_user_todo(db=db, todo_id=todo_id, user_id=user_id)
