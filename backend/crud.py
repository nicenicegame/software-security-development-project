from uuid import UUID
from sqlalchemy.orm import Session
from . import models, schemas


def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate, hashed_password: str, role: str):
    db_user = models.User(
        name=user.name, email=user.email, hashed_password=hashed_password, role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_todos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Todo).offset(skip).limit(limit).all()


def get_user_todos(db: Session, user_id: str, skip: int = 0, limit: int = 100):

    return db.query(models.Todo).filter(models.Todo.owner_id == user_id).all()


def create_user_todo(db: Session, todo: schemas.TodoCreate, user_id: str):
    db_todo = models.Todo(**todo.dict(), owner_id=user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def update_user_todo(db: Session, todo_id: str, user_id: str, todo):
    db_todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id, models.Todo.owner_id == user_id
    )
    if not db_todo.first():
        return
    db_todo.update({"title": todo.title, "is_done": todo.is_done})
    db.commit()


def delete_user_todo(db: Session, todo_id: str, user_id: str):
    db_todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id, models.Todo.owner_id == user_id
    )
    db_todo.delete()
    db.commit()
