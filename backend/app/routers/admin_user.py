from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from ..utils.oauth2 import get_current_admin, pwd_context
from .. import crud, models, schemas
from ..database import get_db
from ..utils.logconfig import logger


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
        if user.role != "admin"
    ]


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
    logger.info(f"admin create a new user")
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
    logger.info("admin update a user")
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
    logger.info("admin delete a user")
    return {"detail": response}
