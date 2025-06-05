 import { useEffect, useState } from "react";

export const TodoListFetch = () => {
  const baseURL = 'https://playground.4geeks.com/todo';
  const user = 'spain-108';

  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const handleNewTask = event => setNewTask(event.target.value);
  const handleEditTask = event => setEditTask(event.target.value);
  const handleEditCompleted = event => setEditCompleted(event.target.checked);

  const createUser = async () => {
    try {
      const res = await fetch(`${baseURL}/users/${user}`);
      if (!res.ok) {
        console.log("El usuario no existe, creando...");
        await fetch(`${baseURL}/users/${user}`, { method: "POST" });
      }
    } catch (err) {
      console.log("Error creando/verificando usuario:", err);
    }
  };

  const getTodos = async () => {
    try {
      const res = await fetch(`${baseURL}/users/${user}`);
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    const task = { label: newTask, is_done: false };
    try {
      const res = await fetch(`${baseURL}/todos/${user}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
      });
      if (res.ok) {
        setNewTask('');
        getTodos();
      }
    } catch (err) {
      console.error("Error al agregar tarea:", err);
    }
  };

  const handleEdit = (todo) => {
    setIsEdit(true);
    setEditTodo(todo);
    setEditTask(todo.label);
    setEditCompleted(todo.is_done);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editTodo.id) {
      alert("Primero haz clic en el icono de editar una tarea.");
      return;
    }

    const updated = { label: editTask, is_done: editCompleted };
    try {
      const res = await fetch(`${baseURL}/todos/${editTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setIsEdit(false);
        setEditTask('');
        setEditCompleted(false);
        setEditTodo({});
        getTodos();
      }
    } catch (err) {
      console.error("Error al editar tarea:", err);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setEditTask('');
    setEditCompleted(false);
    setEditTodo({});
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseURL}/todos/${id}`, { method: "DELETE" });
      if (res.ok) getTodos();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  useEffect(() => {
    createUser().then(getTodos);
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-success">Todo List with Fetch</h1>

      {/* Formu Editar Tarea */}
      <form onSubmit={handleSubmitEdit}>
        <div className="text-start mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Edit Task</label>
          <input type="text" className="form-control" id="exampleInputPassword1"
            value={editTask} onChange={handleEditTask} />
        </div>
        <div className="text-start mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1"
            checked={editCompleted} onChange={handleEditCompleted} />
          <label className="form-check-label" htmlFor="exampleCheck1">Completed</label>
        </div>
        <button type="submit" className="btn btn-primary me-2">Submit</button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
      </form>
      
      {/* Form Agregar Tarea */}
      <form onSubmit={handleSubmitAdd}>
        <div className="text-start mb-3">
          <label htmlFor="exampleTask" className="form-label">Add Task</label>
          <input type="text" className="form-control" id="exampleTask"
            value={newTask} onChange={handleNewTask} />
        </div>
      </form>

      <h2 className="text-primary mt-5">List</h2>

      <ul className="text-start list-group">
        {todos.length > 0 ? (
          todos.map(todo => (
            <li key={todo.id} className="list-group-item hidden-icon d-flex justify-content-between">
              <div>
                {todo.is_done ? (
                  <i className="far fa-thumbs-up text-success me-2"></i>
                ) : (
                  <i className="fas fa-times-circle text-danger me-2"></i>
                )}
                {todo.label}
              </div>
              <div>
                <span style={{ cursor: "pointer" }} onClick={() => handleEdit(todo)}>
                  <i className="fas fa-edit text-primary me-2"></i>
                </span>
                <span style={{ cursor: "pointer" }} onClick={() => handleDelete(todo.id)}>
                  <i className="fas fa-trash text-danger"></i>
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-end">
            No tasks, please add a new task
          </li>
        )}
      </ul>
    </div>
  );
};

export default TodoListFetch;
