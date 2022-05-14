from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from backend.utils.oauth2 import get_current_user
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()


@router.get(
    "/users/",
    tags=["users"],
)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get(
    "/user/todos",
    tags=["users"],
)
def read_user(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    db_user = crud.get_user(db, user_id=current_user.id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_todos = crud.get_user_todos(db, user_id=current_user.id, skip=0, limit=0)
    return {"todos": db_todos}


@router.post("/user/todos", response_model=schemas.Todo, tags=["users"])
def create_item_for_user(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_user_todo(db=db, todo=todo, user_id=current_user.id)


@router.put(
    "/user/todos/{todo_id}",
    tags=["users"],
)
def update_todos_for_user(
    todo_id,
    new_todo: schemas.TodoBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    response = crud.update_user_todo(
        db=db, todo_id=todo_id, user_id=current_user.id, todo=new_todo
    )
    if not response:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")
    return {"detail": response}


@router.delete("/user/todos/{todo_id}", tags=["users"])
def delete_todos_for_user(
    todo_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    response = crud.delete_user_todo(db=db, todo_id=todo_id, user_id=current_user.id)
    if not response:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")
    return {"detail": response}
