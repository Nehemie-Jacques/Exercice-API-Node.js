import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import zlib from 'zlib'; // permet de compresser les fichiers
import { Writable } from 'stream'; // permet de créer un flux d'écriture

const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv"); 
const logpath = path.resolve("database/event.log"); // les actions ( crzéation, modification, suppression) sont loggées dans ce fichier

const logStream = fs.createWriteStream(logpath, { flags: "a"});
// le flag "a" permet d'ajouter les nouvelles données à la fin du fichier
// createWriteStream permet de créer un flux d'écriture vers le fichier log

const log = (message) => {
    const timestamp = new Date().toISOString(); 
    logStream.write(`${date} ${message}\n`);
}
const eventController = {

}

export default eventController;
