import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Boolean, Column, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

load_dotenv(".env.local")

DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")

if DATABASE_URL is None:
    raise RuntimeError("DATABASE_URL 환경변수가 설정되지 않았습니다.")

if FRONTEND_URL is None:
    raise RuntimeError("FRONTEND_URL 환경변수가 설정되지 않았습니다.")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    is_completed = Column(Boolean, default=False)
    date = Column(String, nullable=False)


class TodoCreate(BaseModel):
    text: str
    date: str


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    is_completed: Optional[bool] = None
    date: Optional[str] = None


class TodoResponse(BaseModel):
    id: int
    text: str
    is_completed: bool
    date: str

    model_config = ConfigDict(from_attributes=True)


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    todos = db.query(Todo).order_by(Todo.id.desc()).all()
    return todos


@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(
        text=todo.text,
        date=todo.date,
        is_completed=False,
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo


@app.put("/todos/{id}", response_model=TodoResponse)
def update_todo(id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    target_todo = db.query(Todo).filter(Todo.id == id).first()

    if target_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    if todo.text is not None:
        target_todo.text = todo.text

    if todo.is_completed is not None:
        target_todo.is_completed = todo.is_completed

    if todo.date is not None:
        target_todo.date = todo.date

    db.commit()
    db.refresh(target_todo)

    return target_todo


@app.delete("/todos/{id}")
def delete_todo(id: int, db: Session = Depends(get_db)):
    target_todo = db.query(Todo).filter(Todo.id == id).first()

    if target_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(target_todo)
    db.commit()

    return {"message": "Todo deleted successfully"}