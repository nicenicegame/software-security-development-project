from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel


class TodoBase(BaseModel):
    title: str
    is_done: bool = False


class TodoCreate(TodoBase):
    pass


class Todo(TodoBase):
    id: UUID
    owner_id: UUID

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    name: str
    password: str


class UserGoogle(BaseModel):
    token: str


class User(UserBase):
    id: UUID
    name: str
    todos: List[Todo] = []

    class Config:
        orm_mode = True


class UserShow(BaseModel):
    message: str
    detail: User


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class TokenForm(BaseModel):
    email: str
    password: str
