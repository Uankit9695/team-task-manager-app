import React, { useEffect, useState } from "react";
import API from "../services/api";

// 🔥 CHART IMPORTS
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [data, setData] = useState({});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks/dashboard").then(res => setData(res.data));
    API.get("/tasks").then(res => setTasks(res.data));
  }, []);

  const Card = ({ title, value, color }) => (
    <div className={`p-6 rounded-xl shadow-lg text-white ${color} transform hover:scale-105 transition duration-300`}>
      <h3 className="text-lg">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );

  // 🔥 Progress calculation
  const percent = data.total ? (data.completed / data.total) * 100 : 0;

  // 🔥 Chart data
  const chartData = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          data.completed || 0,
          data.pending || 0,
          data.overdue || 0
        ],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* 🔥 Navbar */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow">
        <h2 className="text-xl font-bold">Team Task Manager</h2>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-white text-indigo-600 px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* 📊 Dashboard */}
      <div className="p-6">
        
        {/* 🔥 Welcome */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Welcome back 👋
        </h2>
        <p className="text-gray-500 mb-6">
          Here’s what’s happening with your tasks today
        </p>

        {/* 🔥 CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card title="Total Tasks" value={data.total || 0} color="bg-blue-500" />
          <Card title="Completed" value={data.completed || 0} color="bg-green-500" />
          <Card title="Pending" value={data.pending || 0} color="bg-yellow-500" />
          <Card title="Overdue" value={data.overdue || 0} color="bg-red-500" />
        </div>

        {/* 🔥 NAVIGATION BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => window.location.href = "/projects"}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Projects
          </button>

          <button
            onClick={() => window.location.href = "/tasks"}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Tasks
          </button>
        </div>

        {/* 🔥 PROGRESS BAR */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">Progress</h3>

          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {Math.round(percent)}% Completed
          </p>
        </div>

        {/* 🔥 RECENT TASKS */}
        <h3 className="text-2xl font-bold mt-10 mb-4">Recent Tasks</h3>

        <div className="bg-white rounded-xl shadow p-5">
          {tasks.length > 0 ? (
            tasks.slice(0, 5).map(task => (
              <div key={task._id} className="flex justify-between items-center border-b py-3 hover:bg-gray-50 px-2 rounded">
                <span>{task.title}</span>

                <span className={`text-xs px-3 py-1 rounded-full text-white 
                  ${task.status === "Done" ? "bg-green-500" :
                    task.status === "In Progress" ? "bg-yellow-500" :
                    "bg-red-500"}`}>
                  {task.status}
                </span>
              </div>
            ))
          ) : (
            <p>No tasks yet</p>
          )}
        </div>

        {/* 🔥 PIE CHART (FIXED SIZE) */}
        <div className="mt-10 bg-white p-5 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Task Distribution</h3>

          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Pie 
                data={chartData} 
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;