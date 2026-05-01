import React, { useEffect, useState } from "react";
import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]); // 🔥 MULTI USER STATE

  const loadTasks = () => {
    API.get("/tasks").then(res => setTasks(res.data));
  };

  useEffect(() => {
    loadTasks();

    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => {});
  }, []);

  // 🔥 CREATE TASK WITH MULTIPLE USERS
  const createTask = () => {
    if (!title) return alert("Enter title");

    API.post("/tasks", {
      title,
      description,
      assignedTo, // 🔥 IMPORTANT
      status: "Todo"
    }).then(() => {
      setTitle("");
      setDescription("");
      setAssignedTo([]);
      loadTasks();
    });
  };

  const updateStatus = (id, status) => {
    API.put(`/tasks/${id}`, { status }).then(loadTasks);
  };

  // 🔥 MULTIPLE USER ASSIGN UPDATE
  const assignUsers = (id, selectedUsers) => {
    API.put(`/tasks/${id}`, { assignedTo: selectedUsers }).then(loadTasks);
  };

  const getColor = (status) => {
    if (status === "Done") return "bg-green-500";
    if (status === "In Progress") return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-3xl font-bold mb-6">Tasks</h2>

      {/* 🔥 CREATE TASK */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-xl font-bold mb-3">Create Task</h3>

        <input
          className="border p-2 mr-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          className="border p-2 mr-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        {/* 🔥 MULTI USER SELECT */}
        <select
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, o => o.value);
            setAssignedTo(selected);
          }}
          className="border p-2 mr-2 rounded"
        >
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        <button
          onClick={createTask}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* 🔥 TASK LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-5 rounded-xl shadow">

            <h3 className="text-xl font-bold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>

            {/* 🔥 SHOW ASSIGNED USERS */}
            <p className="text-sm text-gray-500 mt-2">
              Assigned: {task.assignedTo?.length > 0
                ? task.assignedTo.map(u => u.name).join(", ")
                : "None"}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className={`text-white px-3 py-1 rounded ${getColor(task.status)}`}>
                {task.status}
              </span>

              <select
                value={task.status}
                onChange={(e)=>updateStatus(task._id, e.target.value)}
                className="border p-1 rounded"
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>

            {/* 🔥 MULTI USER ASSIGN */}
            {users.length > 0 && (
              <select
                multiple
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, o => o.value);
                  assignUsers(task._id, selected);
                }}
                className="border mt-3 p-2 rounded w-full"
              >
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default Tasks;