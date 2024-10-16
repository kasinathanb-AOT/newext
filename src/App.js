import React, { useEffect, useState } from "react";
import "./App.css";
import AddTask from "./components/AddTask/AddTask";
import TaskList from "./components/TaskList/TaskList";
import { getTasks, addTask } from "./services/taskServices";
import APIComponent from "./components/APIComponent/APIComponent";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const handleTaskAdded = (newTask) => {
    console.log("Task added:", newTask);
    addTask(newTask);
    setTasks(getTasks());
  };

  const handleClose = () => {
    const appDiv = document.getElementById("react-chrome-extension");
    if (appDiv) {
      appDiv.remove();
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <span className="close-icon" onClick={handleClose}>X</span>
      </div>
      <h2>Task Manager</h2>
      <AddTask onTaskAdded={handleTaskAdded} />
      <TaskList tasks={tasks} setTasks={setTasks} />
      <APIComponent />
    </div>
  );
}

export default App;
