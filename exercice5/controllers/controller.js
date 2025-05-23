import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import eventEmitter from '../events/event.js'; // Import correct
import { promisify } from 'util';

const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv");

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const taskController = {

    // Créer une tâche
    createTask: async (req, res) => {
        try {
            const { title, description } = req.body;
            if (!title || !description) return res.status(400).json("Title and description are required");

            const data = await readFileAsync(jsonpath, "utf-8");
            const tasks = data ? JSON.parse(data) : [];

            const newTask = { id: randomUUID(), title, description };
            tasks.push(newTask);

            await writeFileAsync(jsonpath, JSON.stringify(tasks), "utf-8");

            const csvline = `${newTask.id},${newTask.title},${newTask.description}\n`;
            const csvheaders = "id,title,description\n";

            if (!fs.existsSync(csvpath)) {
                await writeFileAsync(csvpath, csvheaders + csvline, "utf-8");
            } else {
                fs.appendFile(csvpath, csvline, "utf-8", (err) => {});
            }

            eventEmitter.emit("taskCreated", newTask);
            res.status(201).json("Task added");

        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    // Lire toutes les tâches
    getAllTasks : async (req, res) => {
        try {
            const data = await readFileAsync(jsonpath, "utf-8");
            const tasks = data ? JSON.parse(data) : [];
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    // Lire une tâche par ID
    getTaskById: async (req, res) => {
        try {
            const id = req.params.id;
            const data = await readFileAsync(jsonpath, "utf-8");
            const tasks = data ? JSON.parse(data) : [];
            const task = tasks.find(t => t.id === id);
            if (!task) return res.status(404).json("Task not found");
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    // Mettre à jour une tâche
    updateTask: async (req, res) => {
        try {
            const id = req.params.id;
            const { title, description } = req.body;
            if (!title || !description) return res.status(400).json("Title and description are required");

            const data = await readFileAsync(jsonpath, "utf-8");
            const tasks = data ? JSON.parse(data) : [];

            const task = tasks.find(t => t.id === id);
            if (!task) return res.status(404).json("Task not found");

            if (title) task.title = title;
            if (description) task.description = description;

            await writeFileAsync(jsonpath, JSON.stringify(tasks), "utf-8");

            const csvline = `${task.id},${task.title},${task.description}\n`;
            await writeFileAsync(csvpath, "id,title,description\n" + tasks.map(t => `${t.id},${t.title},${t.description}`).join("\n") + "\n", "utf-8");

            eventEmitter.emit("taskUpdated", task);
            res.status(200).json("Task updated");

        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    // Supprimer une tâche
    deleteTask: async (req, res) => {
        try {
            const id = req.params.id;
            const data = await readFileAsync(jsonpath, "utf-8");
            const tasks = data ? JSON.parse(data) : [];

            const newTasks = tasks.filter(t => t.id !== id);
            if (newTasks.length === tasks.length) return res.status(404).json("Task not found");

            await writeFileAsync(jsonpath, JSON.stringify(newTasks), "utf-8");

            const csv = "id,title,description\n" + newTasks.map(t => `${t.id},${t.title},${t.description}`).join("\n") + "\n";
            await writeFileAsync(csvpath, csv, "utf-8");

            eventEmitter.emit("taskDeleted", id);
            res.status(200).json("Task deleted");

        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
};

export default taskController;
