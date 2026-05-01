import React, { useEffect, useState } from "react";
import API from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");

  // 🔥 ADD USER STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const load = async () => {
    const p = await API.get("/projects");
    setProjects(p.data);

    try {
      const u = await API.get("/users");
      setUsers(u.data);
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  const createProject = async () => {
    if (!title) return alert("Enter project title");

    await API.post("/projects", { title });
    setTitle("");
    load();
  };

  // 🔥 ADD USER FUNCTION
  const addUser = async () => {
    if (!name || !email || !password) {
      return alert("Fill all fields");
    }

    try {
      await API.post("/auth/register", { name, email, password });

      alert("User added ✅");

      setName("");
      setEmail("");
      setPassword("");

      load(); // refresh users
    } catch {
      alert("Error adding user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔥 NAVBAR */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow">
        <h2 className="text-lg font-bold">Team Task Manager</h2>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="bg-white text-indigo-600 px-3 py-1 rounded"
          >
            Dashboard
          </button>

          <button
            onClick={() => window.location.href = "/tasks"}
            className="bg-green-500 px-3 py-1 rounded"
          >
            Tasks
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location = "/";
            }}
            className="bg-white text-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📊 CONTENT */}
      <div className="p-6">

        <h2 className="text-3xl font-bold mb-6">Projects</h2>

        {/* 🔥 ADD USER UI */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-bold mb-2">Add User</h3>

          <input
            placeholder="Name"
            className="border p-2 mr-2 rounded"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            placeholder="Email"
            className="border p-2 mr-2 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            className="border p-2 mr-2 rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            onClick={addUser}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* 🔥 CREATE PROJECT */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <input
            className="border p-2 mr-2 rounded"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={createProject}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>

        {/* 🔥 PROJECT LIST */}
        {projects.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow mb-4">

            <h3 className="font-bold text-lg">{p.title}</h3>

            {/* 🔥 SHOW MEMBERS */}
            <p className="text-sm text-gray-500 mt-2">
              Members: {p.members?.length > 0
                ? p.members.map(m => m.name).join(", ")
                : "None"}
            </p>

            {/* 🔥 MULTIPLE ASSIGN MEMBERS */}
            {users.length > 0 && (
              <select
                multiple
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    o => o.value
                  );

                  API.put(`/projects/${p._id}/members`, {
                    members: selected
                  }).then(load);
                }}
                className="border mt-2 p-2 rounded w-full"
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

export default Projects;