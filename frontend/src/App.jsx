import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [tax, setTax] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState(0);
    const [editTax, setEditTax] = useState(0);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/hello").then(res => setMessage(res.data.message));
        axios.get("http://127.0.0.1:8000/api/items").then(res => setItems(res.data));
    }, []);

    const addItem = () => {
        if (name.trim() === "" || description.trim() === "" || price === "") {
            return alert("Заполните все поля!");
        }
        axios.post("http://127.0.0.1:8000/api/items/", { name, description, price: parseFloat(price), tax: parseFloat(tax) || 0 })
            .then(res => {
                setItems([...items, res.data]);
                // Очищаем поля после добавления
                setName("");
                setDescription("");
                setPrice(0);
                setTax(0);
            });
    };

    const deleteItem = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/items/${id}`)
            .then(() => setItems(items.filter(i => i.id !== id)));
    };

    const openModal = (item) => {
        setEditId(item.id);
        setEditName(item.name);
        setEditDescription(item.description);
        setEditPrice(item.price);
        setEditTax(item.tax);
        setIsOpen(true);
    };

    const changeItem = () => {
        axios.put(`http://127.0.0.1:8000/api/items/${editId}`, {
            name: editName, description: editDescription,
            price: parseFloat(editPrice), tax: parseFloat(editTax)
        }).then(res => {
            setItems(items.map(i => i.id === editId ? res.data : i));
            setIsOpen(false);
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{message || "Loading..."}</h1>

            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.name}, {item.description}, {item.price}, {item.tax}
                        <button onClick={() => deleteItem(item.id)}>Delete</button>
                        <button onClick={() => openModal(item)}>Redact</button>
                    </li>
                ))}
            </ul>

            {isOpen && (
                <div style={{ position:"fixed", top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center" }}>
                    <div style={{ background:"white", padding:"20px", borderRadius:"10px" }}>
                        <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} />
                        <input type="text" value={editDescription} onChange={e=>setEditDescription(e.target.value)} />
                        <input type="number" value={editPrice} onChange={e=>setEditPrice(e.target.value)} />
                        <input type="number" value={editTax} onChange={e=>setEditTax(e.target.value)} />
                        <button onClick={changeItem}>Save</button>
                        <button onClick={()=>setIsOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            <div style={{ marginTop:"20px" }}>
                <input type="text" placeholder="Name" onChange={e=>setName(e.target.value)} />
                <input type="text" placeholder="Description" onChange={e=>setDescription(e.target.value)} />
                <input type="number" placeholder="Price" onChange={e=>setPrice(e.target.value)} />
                <input type="number" placeholder="Tax" onChange={e=>setTax(e.target.value)} />
            </div>
            <button onClick={addItem}>Add Item</button>
        </div>
    );
}
