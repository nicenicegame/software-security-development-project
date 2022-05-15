from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from ..utils.oauth2 import get_current_admin, get_current_user, pwd_context
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()


@router.get(
    "/users/",
    tags=["admin"],
)
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin),
):
    users = crud.get_users(db, skip=skip, limit=limit)
    return [
        schemas.User(id=user.id, name=user.name, email=user.email, todos=user.todos)
        for user in users
    ]


@router.get(
    "/user/todo",
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


@router.post("/user", tags=["admin"])
def create_user(
    new_user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user_by_email(db=db, email=new_user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exist"
        )
    return {"detail": "created success"}


@router.put("/user/{user_id}", tags=["admin"])
def update_user(
    user_id: str,
    update_user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    hashed_password = pwd_context.hash(update_user.password)
    response = crud.update_user(
        db=db,
        user_id=user_id,
        updated_user=update_user,
        hashed_password=hashed_password,
    )
    return {"detail": response}


@router.delete("/user/{user_id}", tags=["admin"])
def delete_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    response = crud.delete_user(db=db, user_id=user_id)
    return {"detail": response}


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
