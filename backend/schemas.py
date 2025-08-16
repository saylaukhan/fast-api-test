# backend/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import TodoStatus, UserRole

# Schemas for Todo
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    status: Optional[TodoStatus] = None

class TodoInDB(TodoBase):
    id: int
    user_id: int
    status: TodoStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Schemas for User
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole
    is_verified: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Schemas for Auth
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None