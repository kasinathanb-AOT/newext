import React, { useState } from "react";
import "./AddTask.css";

const AddTask = ({ onTaskAdded }) => {
    const [taskName, setTaskName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim()) {
            const newTask = {
                id: Date.now(),
                name: taskName,
            };
            onTaskAdded(newTask);
            setTaskName("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-task-form">
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Add new task"
                className="task-input"
            />
            <button type="submit" className="add-task-button">Add Task</button>
        </form>
    );
};

export default AddTask;
