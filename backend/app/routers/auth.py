import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from datetime import timedelta
from ..utils.oauth2 import (
    authenticate_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user,
    pwd_context,
)
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from ..utils.logconfig import logger
from ..utils.password import password_check

router = APIRouter(tags=["auth"])

load_dotenv()


@router.post(
    "/signup",
    response_model=schemas.UserShow,
    status_code=201,
)
def create_user_signup(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.UserCreate,
):
    """
    Create new user without the need to be logged in.
    """

    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    if not (exception := password_check(user_in.password)):
        return {"message": "password is too week", "detail": exception}
    hashed_password = pwd_context.hash(user_in.password)
    user = crud.create_user(
        db=db, user=user_in, hashed_password=hashed_password, role="user"
    )
    logger.info(f"an account with id {user.id} created")
    return {"message": "successfully create an account", "detail": user}


@router.post("/login")
def login(
    request: schemas.TokenForm,
    db: Session = Depends(get_db),
):
    """
    Create the JWT for a user with data from OAuth2 request form body.
    """
    user = authenticate_user(username=request.email, password=request.password, db=db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {
        "id": str(user.id),
        "name": user.name,
        "role": user.role,
        "email": user.email,
    }
    access_token = create_access_token(data=data, expires_delta=access_token_expires)
    logger.info(f"(a)n {user.role} account with email {user.email} logged in")
    return {"access_token": access_token, "token_type": "bearer", "details": data}


@router.post("/login/google")
def google_login(request: schemas.UserGoogle, db: Session = Depends(get_db)):
    try:
        user_info = id_token.verify_oauth2_token(request.token, requests.Request())
        user_db = crud.get_user_by_email(db=db, email=user_info["email"])
        if not user_db:
            print("create a new user who logged in via google account")
            user_create = schemas.UserCreate(
                name=user_info["name"], password="", email=user_info["email"]
            )
            user = crud.create_user(
                db=db, user=user_create, hashed_password="", role="user"
            )
        else:
            crud.delete_user(db=db, user_id=user_db.id)
            user = user_db
        data = {
            "id": str(user.id),
            "name": user.name,
            "role": user.role,
            "email": user.email,
        }
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data=data, expires_delta=access_token_expires
        )
        logger.info(f"(a)n {user.role} account with email {user.email} logged in")
        return {"access_token": access_token, "token_type": "bearer", "details": data}

    except ValueError:
        return "unauthorized"


@router.post("/admin")
def create_admin(name: str, email: str, password: str, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(password)
    crud.create_user(
        db=db,
        user=schemas.UserCreate(name=name, email=email, password=password),
        hashed_password=hashed_password,
        role="admin",
    )
    logger.warning("someone create a new admin account")


@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Fetch the current logged in user.
    """

    user = current_user
    return user
