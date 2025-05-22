import fs from "fs";
import csv from "csv-parser"; //  csv-parser permet de convertir chaque ligne du CSV en objet JavaScript.
import XLSX from "xlsx"; // permet de manipuler les fichiers excel

const csvFilePath = "./database/data.csv"; // chemin du fichier csv
const excelFilePath = "./database/data.xlsx"; // chemin du fichier excel

const rows = []; // Initialise un tableau vide rows qui servira à stocker chaque ligne du CSV sous forme d'objet.

fs.createReadStream(csvFilePath) //  Crée un flux de lecture à partir du fichier CSV. Cela permet de lire le fichier ligne par ligne.
  
.pipe(csv()) //  Utilise le module csv-parser pour traiter chaque ligne du flux CSV.
  .on("data", (row) => {
    //  Événement déclenché pour chaque ligne lue du CSV.
    //row est un objet contenant les données de la ligne courante.
    rows.push(row); //  Ajoute chaque ligne sous forme d'objet au tableau rows.
  })

  .on('end', () => {
    //  Événement déclenché lorsque le flux de lecture est terminé.
    //  À ce stade, toutes les lignes du CSV ont été lues et stockées dans le tableau rows.
    const workbook = XLSX.utils.book_new(); // Crée un nouveau classeur Excel.
    const worksheet = XLSX.utils.json_to_sheet(rows); // Convertit le tableau rows en une feuille de calcul Excel.
    XLSX.utils.book_append_sheet(workbook, worksheet, "Livres"); // Ajoute la feuille de calcul au classeur.
    XLSX.writeFile(workbook, excelFilePath); // Écrit le classeur dans un fichier Excel.
    console.log("Conversion CSV → Excel réussie !");
  });
  
// Démarrage automatique si on exécute ce fichier
console.log('Conversion en cours...');
