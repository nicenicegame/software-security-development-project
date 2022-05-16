import dotenv
from sqlalchemy import Column, Boolean, ForeignKey, String
from sqlalchemy.orm import relationship
from .database import Base
from fastapi_utils.guid_type import GUID, GUID_DEFAULT_SQLITE

from dotenv import load_dotenv
import os

load_dotenv()

KEY = os.environ.get("DATABASE_KEY")


class User(Base):
    __tablename__ = "users"

    id = Column(GUID, primary_key=True, default=GUID_DEFAULT_SQLITE)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    todos = relationship("Todo", back_populates="owner")


class Todo(Base):
    __tablename__ = "todos"

    id = Column(GUID, primary_key=True, index=True, default=GUID_DEFAULT_SQLITE)
    title = Column(String, index=True)
    is_done = Column(Boolean)
    owner_id = Column(GUID, ForeignKey("users.id"))
    owner = relationship("User", back_populates="todos")
