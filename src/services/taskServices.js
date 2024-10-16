
export const getTasks = () => {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
};

export const addTask = (task) => {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return tasks
};

export const removeTask = (taskId) => {
    const tasks = getTasks().filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
};