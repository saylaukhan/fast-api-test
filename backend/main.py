# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud, auth, deps
from .database import engine, get_db

# Создаем таблицы в БД при запуске
models.Base.metadata.create_all(bind=engine)

# Создаем экземпляр приложения FastAPI
app = FastAPI()

# Настраиваем CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH ROUTER ---
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])

@auth_router.post("/register")
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Этот email уже зарегистрирован")
    if crud.get_user_by_username(db, username=user.username):
        raise HTTPException(status_code=400, detail="Это имя пользователя уже занято")

    db_user = crud.create_user(db, user)
    crud.set_user_verified(db, db_user) # Сразу активируем пользователя

    return {"message": "Пользователь успешно зарегистрирован. Теперь можно войти."}


@auth_router.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверное имя пользователя или пароль")
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Пользователь не активен")

    access_token = auth.create_access_token(data={"sub": user.username})
    refresh_token = auth.create_refresh_token(data={"sub": user.username})

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@auth_router.get("/me", response_model=schemas.UserPublic)
def read_users_me(current_user: models.User = Depends(deps.get_current_active_user)):
    return current_user

# --- TODOS ROUTER ---
# Этот роутер не был определен в вашем коде!
todos_router = APIRouter(prefix="/api/todos", tags=["todos"], dependencies=[Depends(deps.get_current_active_user)])

@todos_router.get("/", response_model=List[schemas.TodoInDB])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    todos = crud.get_todos(db, user_id=current_user.id, skip=skip, limit=limit)
    return todos

@todos_router.post("/", response_model=schemas.TodoInDB, status_code=status.HTTP_201_CREATED)
def create_todo_item(todo: schemas.TodoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    return crud.create_todo(db=db, todo=todo, user_id=current_user.id)

@todos_router.put("/{todo_id}", response_model=schemas.TodoInDB)
def update_todo_item(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    db_todo = crud.get_todo_by_id(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    if db_todo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет прав для редактирования этой задачи")
    return crud.update_todo(db=db, db_todo=db_todo, todo_update=todo)

@todos_router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo_item(todo_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    db_todo = crud.get_todo_by_id(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    if db_todo.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет прав для удаления этой задачи")
    crud.delete_todo(db=db, db_todo=db_todo)

# Подключаем роутеры к приложению
app.include_router(auth_router)
app.include_router(todos_router)