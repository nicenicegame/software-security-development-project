from sqlalchemy import Column, Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base
from fastapi_utils.guid_type import GUID, GUID_DEFAULT_SQLITE

import uuid


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(GUID, primary_key=True, default=GUID_DEFAULT_SQLITE)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    todos = relationship("Todo", back_populates="owner")


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    id_done = Column(Boolean)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="todos")
