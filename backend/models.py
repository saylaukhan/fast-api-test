from sqlalchemy import Column, Integer, String, Float
from database import Base

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    tax = Column(Float, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)