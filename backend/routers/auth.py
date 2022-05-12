from fastapi import APIRouter, Depends, HTTPException, status
from pydantic.utils import almost_equal_floats
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from ..utils.oauth2 import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user, pwd_context

router = APIRouter()

@router.post("/signup", response_model=schemas.User, status_code=201)  # 1
def create_user_signup(
    *,
    db: Session = Depends(get_db),  # 2
    user_in: schemas.UserCreate,  # 3
):
    """
    Create new user without the need to be logged in.
    """

    user = db.query(models.User).filter(models.User.email == user_in.email).first()  # 4
    if user:
        raise HTTPException(  # 5
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    hashed_password = pwd_context.hash(user_in.password)
    user = crud.create_user(db=db, user=user_in, hashed_password=hashed_password)  # 6

    return user

@router.post("/login")
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()  # 1
):
    """
    Get the JWT for a user with data from OAuth2 request form body.
    """

    user = authenticate_user(username=form_data.username, password=form_data.password, db=db)  # 2
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,  # 4
        "token_type": "bearer",
    }

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Fetch the current logged in user.
    """

    user = current_user
    return user