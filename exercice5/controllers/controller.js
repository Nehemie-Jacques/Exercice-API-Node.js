import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { EventEmitter } from 'events';
import { promisify } from 'util'; // Importer promisify pour les fonctions asynchrones
import { log } from "../utils/logger.js"; // Importer la fonction de log

const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

const eventEmitter = new EventEmitter();

emitter.on('taskCreated', (id) => log('Task created: ${id}'));
emitter.on('taskUpdated', (id) => log('Task updated: ${id}'));
emitter.on('taskDeleted', (id) => log('Task deleted: ${id}'));

const taskController = {

    createProduct : (req, res) => {

    }
}

export default taskController;