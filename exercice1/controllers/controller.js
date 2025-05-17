import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';    

const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv");  

const bookController = {
    createBook: (req, res) => {
        const { title, author } = req.body;
        if (!title || !author) {
            return res.status(400).json('Titre et auteur requis');
        }
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json('Erreur de lecture du fichier');
            const books = data ? JSON.parse(data) : []; 
            const newbook = { id: randomUUID(), title, author };
            books.push(newbook);

            fs.writeFile(jsonpath, JSON.stringify(books), "utf-8", (err) => {
                if (err) return res.status(500).send("Erreur écriture JSON");

                const line = `${newbook.id},${newbook.title},${newbook.author}\n`; // On prépare une ligne de texte CSV à écrire dans data.csv
                const header = "id,title,author\n"; // On prépare l’en-tête du fichier CSV, qui indique les noms des colonnes.

                if (!fs.existsSync(csvpath)) {
                    fs.writeFile(csvpath, header + line, "utf-8", () => {});
                } else {
                    fs.appendFile(csvpath, line, "utf-8", () => {});
                }

                res.status(201).json("Livre ajouté avec succès");
            });
        });
    }
}

export default bookController;


