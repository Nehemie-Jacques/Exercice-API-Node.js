// Ce fichier permet de déclencher des événements

import { EventEmitter } from 'events'; // Importer EventEmitter depuis le fichier event.js

const eventEmitter = new EventEmitter(); // Création d'une instance d'EventEmitter

eventEmitter.on("taskCreated", (task) => { 
    console.log("Évènement taskCreated:", task);
});

eventEmitter.on("taskUpdated", (task) => {
    console.log("Évènement taskUpdated:", task);
});

eventEmitter.on("taskDeleted", (task) => {
    console.log("Évènement taskDeleted: ID ${id}");
});

export default eventEmitter;