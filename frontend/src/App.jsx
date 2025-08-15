import { useEffect, useState } from "react";

export default function App() {
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [tax, setTax] = useState("");
    
    // Состояние для модального окна
    const [editingIndex, setEditingIndex] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editTax, setEditTax] = useState("");

    // Получаем данные с бэкенда при загрузке
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/hello")
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(err => console.error(err));

        fetch("http://127.0.0.1:8000/api/items")
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error(err));
    }, []);

    // Очистка полей формы
    const clearForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setTax("");
    };

    // Добавляем новый элемент
    const addItem = () => {
        if (!name.trim() || !description.trim() || !price || !tax) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }
        
        fetch("http://127.0.0.1:8000/api/items/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                tax: parseFloat(tax)
            })
        })
        .then(res => res.json())
        .then(data => {
            setItems([...items, data]);
            clearForm(); // Очищаем форму после успешного добавления
        })
        .catch(err => console.error(err));
    };

    // Удаляем элемент
    const deleteItem = (index) => {
        fetch(`http://127.0.0.1:8000/api/items/${index}`, {
            method: "DELETE"
        })
        .then(res => {
            if (res.ok) {
                setItems(items.filter((_, i) => i !== index));
            }
        })
        .catch(err => console.error(err));
    };

    // Изменяем элемент
    const changeItem = (index) => {
        if (!editName.trim() || !editDescription.trim() || !editPrice || !editTax) {
            alert("Пожалуйста, заполните все поля!");
            return;
        }

        fetch(`http://127.0.0.1:8000/api/items/${index}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: editName.trim(),
                description: editDescription.trim(),
                price: parseFloat(editPrice),
                tax: parseFloat(editTax)
            })
        })
        .then(res => res.json())
        .then(data => {
            const updatedItems = [...items];
            updatedItems[index] = data;
            setItems(updatedItems);
            closeModal();
        })
        .catch(err => console.error(err));
    };

    // Открываем модальное окно для редактирования
    const openModal = (index, {name, description, price, tax}) => {
        setEditingIndex(index);
        setEditName(name);
        setEditDescription(description);
        setEditPrice(price.toString());
        setEditTax(tax.toString());
    };

    // Закрываем модальное окно
    const closeModal = () => {
        setEditingIndex(null);
        setEditName("");
        setEditDescription("");
        setEditPrice("");
        setEditTax("");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{message || "Loading..."}</h1>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {items.map((item, index) => (
                    <li key={index} style={{ margin: "10px 0", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                        <div>
                            <strong>{item.name}</strong> - {item.description} 
                            <br />
                            Цена: ${item.price}, Налог: {item.tax}%
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <button 
                                onClick={() => deleteItem(index)}
                                style={{ marginRight: "10px", backgroundColor: "#ff4444", color: "white", border: "none", padding: "5px 10px", borderRadius: "3px" }}
                            >
                                Delete
                            </button>
                            <button 
                                onClick={() => openModal(index, item)}
                                style={{ backgroundColor: "#4444ff", color: "white", border: "none", padding: "5px 10px", borderRadius: "3px" }}
                            >
                                Edit
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Модальное окно */}
            {editingIndex !== null && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000
                    }}
                >
                    <div style={{ 
                        backgroundColor: "white", 
                        padding: "20px", 
                        borderRadius: "10px",
                        minWidth: "300px"
                    }}>
                        <h3>Редактировать элемент</h3>
                        <div style={{ marginBottom: "10px" }}>
                            <input 
                                type="text" 
                                value={editName} 
                                placeholder="Название" 
                                onChange={(e) => setEditName(e.target.value)}
                                style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
                            />
                            <input 
                                type="text" 
                                value={editDescription} 
                                placeholder="Описание" 
                                onChange={(e) => setEditDescription(e.target.value)}
                                style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
                            />
                            <input 
                                type="number" 
                                value={editPrice} 
                                placeholder="Цена" 
                                onChange={(e) => setEditPrice(e.target.value)}
                                style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
                            />
                            <input 
                                type="number" 
                                value={editTax} 
                                placeholder="Налог" 
                                onChange={(e) => setEditTax(e.target.value)}
                                style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                            />
                        </div>
                        <button 
                            onClick={() => changeItem(editingIndex)}
                            style={{ marginRight: "10px", backgroundColor: "#44aa44", color: "white", border: "none", padding: "8px 15px", borderRadius: "3px" }}
                        >
                            Сохранить
                        </button>
                        <button 
                            onClick={closeModal}
                            style={{ backgroundColor: "#aaa", color: "white", border: "none", padding: "8px 15px", borderRadius: "3px" }}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {/* Форма добавления */}
            <div style={{ marginTop: "30px", padding: "20px", border: "2px solid #ccc", borderRadius: "10px", display: "inline-block" }}>
                <h3>Добавить новый элемент</h3>
                <input 
                    type="text" 
                    placeholder="Название" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ margin: "5px", padding: "5px" }}
                />
                <input 
                    type="text" 
                    placeholder="Описание" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ margin: "5px", padding: "5px" }}
                />
                <input 
                    type="number" 
                    placeholder="Цена" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ margin: "5px", padding: "5px" }}
                />
                <input 
                    type="number" 
                    placeholder="Налог" 
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    style={{ margin: "5px", padding: "5px" }}
                />
                <br />
                <button 
                    style={{ marginTop: "10px", backgroundColor: "#44aa44", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px" }} 
                    onClick={addItem}
                >
                    Добавить элемент
                </button>
            </div>
        </div>
    );
}