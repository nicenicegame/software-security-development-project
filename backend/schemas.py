from typing import List, Optional

from pydantic import BaseModel


class TodoBase(BaseModel):
    title: str
    is_done: bool


class TodoCreate(TodoBase):
    pass


class Todo(TodoBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    todos: List[Todo] = []

    class Config:
        orm_mode = True
