import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import TodoService from '../services/todo.service';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';


export default function Todos() {
    const [todos, setTodos] = useState([]);
    const [todoDialog, setTodoDialog] = useState(false);
    const [todo, setTodo] = useState({ id: null, title: '', description: '' });
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        TodoService.getTodos().then(response => {
            setTodos(response.data);
        }).catch(err => {
            toast.current.show({severity:'error', summary: 'Ошибка', detail:'Не удалось загрузить задачи', life: 3000});
            if (err.response && err.response.status === 401) {
                AuthService.logout();
                navigate('/login');
            }
        })
    }, [navigate]);

    const openNew = () => {
        setTodo({ id: null, title: '', description: '' });
        setTodoDialog(true);
    };
    
    const hideDialog = () => {
        setTodoDialog(false);
    };

    const saveTodo = () => {
        if (todo.id) { // Update
            TodoService.updateTodo(todo.id, todo.title, todo.description, 'open').then(response => {
                setTodos(todos.map(item => item.id === todo.id ? response.data : item));
                toast.current.show({severity:'success', summary: 'Успешно', detail:'Задача обновлена', life: 3000});
            });
        } else { // Create
            TodoService.createTodo(todo.title, todo.description).then(response => {
                setTodos([...todos, response.data]);
                toast.current.show({severity:'success', summary: 'Успешно', detail:'Задача создана', life: 3000});
            });
        }
        setTodoDialog(false);
    };
    
    const editTodo = (todoData) => {
        setTodo({ ...todoData });
        setTodoDialog(true);
    };

    const confirmDeleteTodo = (todoData) => {
        confirmDialog({
            message: 'Вы уверены, что хотите удалить эту задачу?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteTodo(todoData.id)
        });
    };

    const deleteTodo = (id) => {
        TodoService.deleteTodo(id).then(() => {
            setTodos(todos.filter(item => item.id !== id));
            toast.current.show({severity:'success', summary: 'Успешно', detail:'Задача удалена', life: 3000});
        });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _todo = {...todo};
        _todo[`${name}`] = val;
        setTodo(_todo);
    }
    
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editTodo(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTodo(rowData)} />
            </React.Fragment>
        );
    }
    
    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Управление задачами</h5>
            <span className="p-input-icon-left">
                <Button label="Новая" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            </span>
        </div>
    );
    
    const todoDialogFooter = (
        <React.Fragment>
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Сохранить" icon="pi pi-check" className="p-button-text" onClick={saveTodo} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <DataTable value={todos} header={header} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="title" header="Заголовок" sortable></Column>
                    <Column field="description" header="Описание"></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>
            
            <Dialog visible={todoDialog} style={{ width: '450px' }} header="Детали задачи" modal className="p-fluid" footer={todoDialogFooter} onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="title">Заголовок</label>
                    <InputText id="title" value={todo.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus />
                </div>
                <div className="p-field">
                    <label htmlFor="description">Описание</label>
                    <InputTextarea id="description" value={todo.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>
            </Dialog>
        </div>
    )
}