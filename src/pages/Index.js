import { useEffect, useState } from "react";
import "./Index.scss";
import { createUser, fetchTodo } from "../services/APIServices";
import { addTask, getTasks, removeTask } from "../services/taskServices";
import { CloseIcon } from "../assets/Index";

function Index() {
    const [GetAPIResponse, setGetAPIResponse] = useState();
    const [POSTAPIResponse, setPOSTAPIResponse] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [socket, setSocket] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isMicOn, setIsMicOn] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    useEffect(() => {
        setTasks(getTasks());
    }, []);

    const handleGetAPI = async () => {
        setLoading(true);
        const response = await fetchTodo();
        setGetAPIResponse(response);
        setLoading(false);
    };

    const handlePostAPI = async () => {
        setLoading(true);
        try {
            const userData = await createUser(name);
            setPOSTAPIResponse(userData);
            setName("");
        } catch (error) {
            console.error("Error posting data:", error);
            setPOSTAPIResponse(null);
        } finally {
            setLoading(false);
        }
    };

    const handleNewTask = async () => {
        setLoading(true);
        const taskData = {
            id: Date.now(),
            name: newTask,
        };
        const updatedTasks = [...tasks, taskData];
        setTasks(updatedTasks);
        await addTask(taskData);
        setNewTask("");
        setLoading(false);
    };

    // Function to remove a task
    const handleRemoveTask = (taskIndex) => {
        setLoading(true);
        const taskToRemove = tasks[taskIndex];
        const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
        setTasks(updatedTasks);
        removeTask(taskToRemove.id);
        setLoading(false);
    };

    // Function to handle closing the extension
    const handleClose = () => {
        const appDiv = document.getElementById("react-chrome-extension");
        const appScript = document.getElementById("react-app-script");

        if (appDiv) {
            appDiv.remove();
        }
        if (appScript) {
            appScript.remove();
        }
    };

    // WebSocket connection function
    const connectWebSocket = () => {
        const ws = new WebSocket("wss://api.aiscribe.quipohealth.com/ws");
        ws.onopen = () => {
            console.log("WebSocket connection opened");
        };
        ws.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
        };
        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        return ws;
    };

    // Microphone and audio handling
    const handleMic = async () => {
        if (isMicOn) {
            // Stop recording
            setIsMicOn(false);
            mediaRecorder.stop();
            socket.close();
        } else {
            // Start recording
            setIsMicOn(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ws = connectWebSocket();
            setSocket(ws);

            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);

            recorder.ondataavailable = (event) => {
                setAudioChunks((prev) => [...prev, event.data]);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                setAudioChunks([]);
            };

            recorder.start(1000);
        }
    };

    return (
        <div className="indexPage custom-scrollbar">
            <div className="popUp">
                <div className="popupHeader">
                    <h2>Extension</h2>
                    <div onClick={handleClose} className="closeIcon">
                        <CloseIcon />
                    </div>
                </div>
                <div className="popUpContent">
                    <div className="upperDiv">
                        <input
                            type="text"
                            id="taskName"
                            className="myextInput"
                            value={newTask}
                            placeholder="Enter the task"
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button
                            className="myextBtn"
                            onClick={handleNewTask}
                            disabled={!newTask || loading}
                        >
                            {loading ? "Adding..." : "Add Task"}
                        </button>
                    </div>
                    <div className="upperDiv">
                        <input
                            type="text"
                            id="userName"
                            className="myextInput"
                            value={name}
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button
                            className="myextBtn"
                            onClick={handlePostAPI}
                            disabled={!name || loading}
                        >
                            {loading ? "Adding..." : "Submit Name"}
                        </button>
                    </div>
                    <div className="bottomDiv">
                        <button onClick={handleGetAPI} className="myextBtn">GET API</button>
                        <button onClick={handleMic} className="myextBtn">
                            {isMicOn ? "Turn Off Mic" : "Turn On Mic"}
                        </button>
                    </div>
                </div>
                {audioUrl && (
                    <div className="audioPlayback">
                        <h3>Recorded Audio:</h3>
                        <audio controls src={audioUrl}></audio>
                    </div>
                )}
                {GetAPIResponse && (
                    <div className="results">
                        <h2>API Response:</h2>
                        {GetAPIResponse.title ? (
                            <div className="leftList">
                                <p><strong>ID:</strong> {GetAPIResponse.id}</p>
                                <p><strong>Title:</strong> {GetAPIResponse.title}</p>
                                <p><strong>Completed:</strong> {GetAPIResponse.completed ? 'Yes' : 'No'}</p>
                            </div>
                        ) : (
                            <p>No data found.</p>
                        )}
                    </div>
                )}
                {POSTAPIResponse && (
                    <div className="results">
                        <h2>POST API Response:</h2>
                        {POSTAPIResponse ? (
                            <div className="leftList">
                                <p><strong>Name:</strong> {POSTAPIResponse.name}</p>
                                <p><strong>ID:</strong> {POSTAPIResponse.id}</p>
                            </div>
                        ) : (
                            <p>No data found.</p>
                        )}
                    </div>
                )}
                {tasks.length > 0 && (
                    <div className="results">
                        <h2>Tasks</h2>
                        {tasks.map((task, index) => (
                            <div className="listItem" key={task.id}>
                                <div className="leftList">
                                    <p className="id">{index + 1})</p>
                                    <p>{task.name}</p>
                                </div>
                                <button onClick={() => handleRemoveTask(index)} disabled={loading} className="myextBtn">
                                    {loading ? "Removing..." : "Remove"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Index;
