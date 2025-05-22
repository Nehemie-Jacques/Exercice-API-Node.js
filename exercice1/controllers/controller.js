import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv");

const bookController = {

    createBook: (req, res) => {
        const { title, author } = req.body; // Destructuration de l'objet req.body
        if (!title || !author) {
            return res.status(400).json("Titre et auteur requis");
        }

        fs.readFile(jsonpath, "utf-8", (err, data) => {

            if (err) return res.status(500).json("Erreur de lecture du fichier");
            const books = data ? JSON.parse(data) : []; // Lecture du fichier JSON
            const newbook = { id: randomUUID(), title, author };
            books.push(newbook);

            fs.writeFile(jsonpath, JSON.stringify(books), "utf-8", (err) => { 
                if (err) return res.status(500).send("Erreur écriture JSON");

                const line = `${newbook.id},${newbook.title},${newbook.author}\n`; // Création de la ligne CSV
                const header = "id,title,author\n"; // Création de l'en-tête CSV

                // Vérification si le fichier CSV existe déjà
                if (!fs.existsSync(csvpath)) {
                    fs.writeFile(csvpath, header + line, "utf-8", () => { });  
                } else {
                    fs.appendFile(csvpath, line, "utf-8", () => { });
                }

                res.status(201).json("Livre ajouté avec succès");
            });
        });
    },

    getAllBooks: (req, res) => {
        fs.readFile(jsonpath, "utf-8", (err, data) => {

            if (err) return res.status(500).json("Erreur de lecture du fichier");
            const books = data ? JSON.parse(data) : [];

            let csv = "id,title,author\n";
            books.forEach((book) => { 
                csv += `${book.id},${book.title},${book.author}\n`;
            });

            fs.writeFile(csvpath, csv, "utf-8", (err) => {
                if (err) console.log("Erreur écriture csv");
            });

            res.json(books);
        });
    },

    getBookById: (req, res) => {
        const id = req.params.id;

        fs.readFile(jsonpath, "utf-8", (err, data) => {

            if (err) return res.status(500).json("Erreur de lecture du fichier");
            const books = data ? JSON.parse(data) : [];
            const book = books.find((book) => book.id === id);
            if (!book) return res.status(404).send("Livre non trouvé");

            res.status(200).json(book);
        });
    },

    updateBook: (req, res) => {
        const { title, author } = req.body;
        const id = req.params.id;

        fs.readFile(jsonpath, "utf-8", (err, data) => {

            if (err) return res.status(500).json("Erreur de lecture du fichier");
            const books = data ? JSON.parse(data) : [];
            const book = books.find((book) => book.id === id);
            if (!book) return res.status(404).send("Livre non trouvé");

            if (title) book.title = title; 
            if (author) book.author = author;

            fs.writeFile(jsonpath, JSON.stringify(books), "utf-8", (err) => {
                if (err) return res.status(500).send("Erreur écriture JSON");

                let csv = "id,title,author\n";
                books.forEach((book) => {
                    csv += `${book.id},${book.title},${book.author}\n`;
                });

                fs.writeFile(csvpath, csv, "utf-8", (err) => {
                    if (err) console.log("Erreur écriture csv");
                    res.send("Livre mis à jour avec succès");
                });
            });
        });
    },

    deleteBook: (req, res) => {
        const id = req.params.id;
        
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json("Erreur de lecture du fichier");
            const books = data ? JSON.parse(data) : [];

            const filteredBooks = books.filter(book => book.id !== id);
            if (filteredBooks.length === books.length) {
                return res.status(404).send("Livre non trouvé");
            }

            fs.writeFile(jsonpath, JSON.stringify(filteredBooks), "utf-8", (err) => {
                if (err) return res.status(500).send("Erreur écriture JSON");

                let csv = "id,title,author\n";
                filteredBooks.forEach((book) => {
                    csv += `${book.id},${book.title},${book.author}\n`;
                });

                fs.writeFile(csvpath, csv, "utf-8", (err) => {
                    if (err) console.log("Erreur écriture csv");
                    res.send("Livre supprimé avec succès");
                });
            });
        });
    }
};

export default bookController;
