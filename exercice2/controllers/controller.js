import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv");

const contactController = {
    createContact: (req, res) => {
        const { nom, email, phone } = req.body;
        if (!nom || !email || !phone) {
            return res.status(400).json("Nom, email et téléphone requis");
        }

        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json("Erreur de lecture du fichier");
            const contacts = data ? JSON.parse(data) : [];
            const newContact = { id: randomUUID(), nom, email, phone };
            contacts.push(newContact);

            fs.writeFile(jsonpath, JSON.stringify(contacts), "utf-8", (err) => {
                if (err) return res.status(500).send("Erreur écriture JSON");

                const line = `${newContact.id},${newContact.nom},${newContact.email},${newContact.phone}\n`;
                const header = "id,nom,email,phone\n";

                if (!fs.existsSync(csvpath)) {
                    fs.writeFile(csvpath, header + line, "utf-8", () => { });
                } else {
                    fs.appendFile(csvpath, line, "utf-8", () => { });
                }

                res.status(201).json("Contact ajouté avec succès");
            });
        });
    }
}

export default contactController;