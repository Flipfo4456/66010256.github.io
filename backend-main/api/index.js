const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const TASKS_FILE = "tasks.json";
const STUDY_FILE = "study_time.json";

// Load tasks from JSON file
function loadTasks() {
    if (!fs.existsSync(TASKS_FILE)) return [];
    return JSON.parse(fs.readFileSync(TASKS_FILE));
}

// Save tasks to JSON file
function saveTasks(data) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
}

// API: Get all tasks
app.get("/tasks", (req, res) => res.json(loadTasks()));

// API: Add new task
app.post("/tasks", (req, res) => {
    const { subject, color = "#5A91E6", completed = false } = req.body;
    if (!subject) return res.status(400).json({ error: "Missing task subject" });

    const tasks = loadTasks();
    const newTask = { id: Date.now(), subject, color, completed };
    tasks.push(newTask);
    saveTasks(tasks);

    res.json({ message: "✅ Task added successfully", task: newTask });
});

// API: Update task
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const tasks = loadTasks();

    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

    tasks[taskIndex].completed = completed;
    saveTasks(tasks);

    res.json({ message: "✅ Task updated successfully", task: tasks[taskIndex] });
});

// API: Delete task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    let tasks = loadTasks();

    const newTasks = tasks.filter(task => task.id != id);
    if (tasks.length === newTasks.length) return res.status(404).json({ error: "Task not found" });

    saveTasks(newTasks);
    res.json({ message: "🗑 Task deleted successfully" });
});

// API: Get study time data
app.get("/study-time", (req, res) => res.json(loadStudyTime()));

// API: Save study time
app.post("/study-time", (req, res) => {
    const { subject, timeSpent } = req.body;
    if (!subject || !timeSpent) return res.status(400).json({ error: "Missing subject or timeSpent" });

    const studyData = loadStudyTime();
    studyData.push({ subject, timeSpent, date: new Date().toISOString() });
    saveStudyTime(studyData);

    res.json({ message: "✅ Study time saved successfully" });
});

// Export as a serverless function for Vercel
module.exports = app;
