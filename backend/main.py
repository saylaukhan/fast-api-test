from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
app = FastAPI()

# Разрешаем запросы именно с порта фронтенда
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешаем доступ
    allow_credentials=True,
    allow_methods=["*"],    # Разрешаем любые методы (GET, POST и т.д.)
    allow_headers=["*"],    # Разрешаем любые заголовки
)

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None
items = []
@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.get("/api/items")
def read_items():
    return items

@app.post("/api/items/")
def create_item(item: Item):
    items.append(item)
    return {'name': item.name,
            'description': item.description,
            'price': item.price,
            'tax': item.tax
            }
@app.delete("/api/items/{item_id}")
def delete_item(item_id: int):
    if 0 <= item_id < len(items):
        deleted_item = items.pop(item_id)
        return {"message": "Item deleted", "item": deleted_item}
    return {"message": "Item not found"}
@app.put("/api/items/{item_id}")
def update_item(item_id: int, item: Item):
    if 0 <= item_id < len(items):
        items[item_id] = item
        return {"message": "Item updated", "item": item}
    return {"message": "Item not found"}