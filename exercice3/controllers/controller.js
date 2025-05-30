import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import zlib from "zlib"; // permet de compresser les fichiers
import { Writable } from "stream"; // permet de créer un flux d'écriture

const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv");
const logpath = path.resolve("database/event.log");

const logStream = fs.createWriteStream(logpath, { flags: "a" });
// Crée un flux d'écriture pour le fichier de log
// Le flag 'a' permet d'ajouter des données à la fin du fichier sans l'écraser

// La fonction prend un message en paramètre et écrit la date et le message dans le fichier de log
// La date est au format ISO 8601
// La fonction utilise le module fs pour écrire dans le fichier de log
const log = (message) => {
    const date = new Date().toISOString(); // format de la date
    logStream.write(`${date} ${message}\n`); // écrit la date et le message dans le fichier de log
};

const eventController = {
    createEvent: (req, res) => {
        const { type, message } = req.body;
        if (!type || !message)
            return res.status(400).json("Type and message are required");

        fs.readFile(jsonpath, "utf-8", (err, data) => {
            const events = data ? JSON.parse(data) : [];
            const newEvent = {
                id: randomUUID(),
                type,
                message,
                date: new Date().toISOString(),
            };
            events.push(newEvent);

            fs.writeFile(jsonpath, JSON.stringify(events), "utf-8", (err) => {
                if (err)
                    return res
                        .status(500)
                        .json("Erreur lors de l'écriture du fichier JSON");

                const csvline = `${newEvent.id},${newEvent.type},${newEvent.message},${newEvent.date}\n`;
                const csvheaders = "id,type,message,date\n";

                if (!fs.existsSync(csvpath)) {
                    fs.writeFileSync(csvpath, csvheaders);
                }

                fs.appendFile(csvpath, csvline, "utf-8", (err) => {
                    if (err) return res.status(500).json("Erreur lors de l'ajout au CSV");

                    log(`Événement créé: ${newEvent.id}`);
                    res.status(201).json("Événement ajouté");
                });
            });
        });
    },

    getAllEvents: (req, res) => {
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err)
                return res
                    .status(500)
                    .json("Erreur lors de la lecture du fichier JSON");
            const events = data ? JSON.parse(data) : [];
            log("Tous les événements récupérés");
            res.status(200).json(events);
        });
    },

    getEventById: (req, res) => {
        const id = req.params.id;
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err)
                return res
                    .status(500)
                    .json("Erreur lors de la lecture du fichier JSON");
            const events = data ? JSON.parse(data) : [];
            const event = events.find((e) => e.id === id);
            if (!event) return res.status(404).json("Événement non trouvé");
            log(`Événement récupéré: ${id}`);
            res.status(200).json(event);
        });
    },

    updateEvent: (req, res) => {
        const id = req.params.id;
        const { type, message } = req.body;
        if (!type || !message)
            return res.status(400).json("Type and message are required");

        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err)
                return res
                    .status(500)
                    .json("Erreur lors de la lecture du fichier JSON");
            const events = data ? JSON.parse(data) : [];
            const event = events.find((e) => e.id === id);

            if (!type) event.type = type;
            if (!message) event.message = message;

            fs.writeFile(jsonpath, JSON.stringify(events), "utf-8", (err) => {
                if (err)
                    return res
                        .status(500)
                        .json("Erreur lors de l'écriture du fichier JSON");
                         
                const csv = // permet de créer un fichier CSV
                    "id,type,message,date\n" +
                    events
                        .map((e) => `${e.id},${e.type},${e.message},${e.date}`) // permet de créer une ligne CSV pour chaque événement
                        .join("\n") +
                    "\n";

                fs.writeFile(csvpath, csv, "utf-8", (err) => {
                    log(`Événement mis à jour: ${id}`);
                    res.status(200).json("Événement mis à jour");
                });
            });
        });
    },

    deleteEvent: (req, res) => {
        const { id } = req.params;
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err)
                return res
                    .status(500)
                    .json("Erreur lors de la lecture du fichier JSON");
            const events = data ? JSON.parse(data) : [];
            const event = events.filter((e) => e.id === id);
            if (event.length === events.length)
                return res.status(404).json("Événement non trouvé");

            fs.writeFile(jsonpath, JSON.stringify(event), "utf-8", (err) => {
                const csv =
                    "id,type,message,date\n" +
                    event
                        .map((e) => `${e.id},${e.type},${e.message},${e.date}`)
                        .join("\n") +
                    "\n";

                fs.writeFile(csvpath, csv, "utf-8", (err) => {
                    log(`Événement supprimé: ${id}`);
                    res.status(200).json("Événement supprimé");
                });
            });
        });
    },

    // Fonction pour compresser le fichier de log
    compressLogs: (req, res) => {
        const source = fs.createReadStream(logpath); // Crée un flux de lecture pour le fichier de log
        const destination = fs.createWriteStream(logpath + ".gz"); // Crée un flux d'écriture pour le fichier compressé
        const gzip = zlib.createGzip(); // Crée un flux de compression gzip

        source.pipe(gzip).pipe(destination); // Pipe le flux de lecture dans le flux de compression, puis dans le flux d'écriture

        destination.on("finish", () => { 
            log("Fichier de log compressé");
            res.status(200).json("Fichier de log compressé");
        });
    },
};

export default eventController;
