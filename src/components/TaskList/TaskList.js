import React from "react";
import "./TaskList.css";
import { getTasks, removeTask } from "../../services/taskServices";

const TaskList = ({ tasks, setTasks }) => {
    const handleRemoveTask = (taskId) => {
        removeTask(taskId);
        setTasks(getTasks());
    };

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <li key={task.id} className="task-item">
                    <span>{task.name}</span>
                    <button className="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;