from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..utils.oauth2 import get_current_admin
from .. import crud, models, schemas
from ..database import get_db
from typing import List
from ..routers.user import (
    read_user,
    create_todo_for_user,
    update_todos_for_user,
    delete_todos_for_user,
)
from ..utils.logconfig import logger

router = APIRouter(tags=["admin"])


@router.get(
    "/todos/",
    response_model=List[schemas.Todo],
)
def read_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    todos = crud.get_todos(db, skip=skip, limit=limit)
    return todos


@router.get(
    "/user/{user_id}/todos",
    tags=["admin"],
)
def read_user_todo(
    user_id,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_todos = crud.get_user_todos(db=db, user_id=user_id)
    return {"todos": db_todos}


@router.get("/user/{user_id}/todos/{todo_id}")
def read_todos(
    user_id: str,
    todo_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user(db=db, user_id=user_id)
    todo = read_user(db=db, current_user=db_user)
    return {"todos": todo}


@router.post("/user/{user_id}/todos")
def create_todo(
    user_id: str,
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user(db=db, user_id=user_id)
    print(f"db user {db_user}")
    return create_todo_for_user(db=db, todo=todo, current_user=db_user)


@router.put("/user/{user_id}/todos/{todo_id}")
def update_todo(
    user_id: str,
    todo_id: str,
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user(db=db, user_id=user_id)
    return update_todos_for_user(
        db=db, todo_id=todo_id, new_todo=todo, current_user=db_user
    )


@router.delete("/user/{user_id}/todos/{todo_id}")
def delete_todo(
    user_id: str,
    todo_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user(db=db, user_id=user_id)
    return delete_todos_for_user(db=db, todo_id=todo_id, current_user=db_user)
