// Ce fichier permet de déclencher des événements

import { EventEmitter } from 'events';
export const eventEmitter = new EventEmitter();

eventEmitter.on("taskCreated", (task) => {
    console.log("Évènement taskCreated:", task);
});

eventEmitter.on("taskUpdated", (task) => {
    console.log("Évènement taskUpdated:", task);
});

eventEmitter.on("taskDeleted", (task) => {
    console.log("Évènement taskDeleted: ID ${id}");
});
