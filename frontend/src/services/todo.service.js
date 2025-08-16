import api from "./api";

const getTodos = () => {
    return api.get("/todos/");
};

const createTodo = (title, description) => {
    return api.post("/todos/", { title, description });
};

const updateTodo = (id, title, description, status) => {
    return api.put(`/todos/${id}`, { title, description, status });
};

const deleteTodo = (id) => {
    return api.delete(`/todos/${id}`);
};


const TodoService = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
};

export default TodoService;