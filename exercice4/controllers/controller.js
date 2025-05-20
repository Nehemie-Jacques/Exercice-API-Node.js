import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { log } from "../utils/logger.js"; // Importer la fonction de log
import { get } from "http";
import { hostname } from "os";


const jsonpath = path.resolve("database/data.json");
const csvpath = path.resolve("database/data.csv");

const productController = {

    createProduct: (req, res) => {
        const { name, price } = req.body;
        if (!name || !price) return res.status(400).json("Name and price are required");

        fs.readFile(jsonpath, "utf-8", (err, data) => {
            const products = data ? JSON.parse(data) : [];
            const newProduct = { id: randomUUID(), name, price };
            products.push(newProduct);

            fs.writeFile(jsonpath, JSON.stringify(products), "utf-8", (err) => {
                if (err) return res.status(500).json("Error writing to JSON file");

                const csvline = `${newProduct.id},${newProduct.name},${newProduct.price}\n`;
                const csvheaders = "id,name,price\n";

                if (!fs.existsSync(csvpath)) {
                    fs.writeFileSync(csvpath, csvheaders);
                }

                fs.appendFile(csvpath, csvline, "utf-8", (err) => {
                    if (err) return res.status(500).json("Error appending to CSV");

                    log(`Product created: ${newProduct.id}`);
                    res.status(201).json("Product added");
                });
            });
        })
    },

    getAllProducts: (req, res) => {
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json("Error reading JSON file");
            const products = data ? JSON.parse(data) : [];
            res.status(200).json(products);
        });
    },

    getProductById: (req, res) => {
        const { id } = req.params;
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json("Error reading JSON file");
            const products = data ? JSON.parse(data) : [];
            const product = products.find(p => p.id === id);
            if (!product) return res.status(404).json("Product not found");
            res.status(200).json(product);
        });
    },

    updateProduct: (req, res) => {
        const { id } = req.params;
        const { name, price } = req.body;

        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json("Error reading JSON file");
            const products = data ? JSON.parse(data) : [];
            const product = products.find(p => p.id === id);

            if (!name) product.name = name;
            if (!price) product.price = price;

            fs.writeFile(jsonpath, JSON.stringify(products), "utf-8", (err) => {
                if (err) return res.status(500).json("Error writing to JSON file");

                const csv = "id,name,price\n" + products.map(p =>
                    `${p.id},${p.name},${p.price}`).join("\n") + "\n";

                fs.writeFile(csvpath, csv, "utf-8", () => {
                    log(`Product updated: ${id}`);
                    res.status(200).json("Product updated");
                })

            });

        })
    },

    deleteProduct: (req, res) => {
        const { id } = req.params;
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json("Error reading JSON file");
            const products = data ? JSON.parse(data) : [];
            const product = products.filter(p => p.id === id);
            if (product.length === products.length) return res.status(404).json("Product not found");

            fs.writeFile(jsonpath, JSON.stringify(products), "utf-8", (err) => {
                if (err) return res.status(500).json("Error writing to JSON file");

                const csv = "id,name,price\n" + products.map(p =>
                    `${p.id},${p.name},${p.price}`).join("\n") + "\n";

                fs.writeFile(csvpath, csv, "utf-8", () => {
                    log(`Product deleted: ${id}`);
                    res.status(200).json("Product deleted");
                })
            });
        })
    },

    getProductsWithPromos: (req, res) => {
        fs.readFile(jsonpath, "utf-8", (err, data) => {
            if (err) return res.status(500).json("Error reading JSON file");
            const products = data ? JSON.parse(data) : [];
            const productsWithPromo = products.filter(p => p.promo);
            const options = {
                hostname: 'localhost',
                port: 3001,
                path: '/promos',
                method: 'GET',
            }

            const request = get(options, (response) => {
                let body = "";
                response.on("data", chunk => (body += chunk));
                response.on("end", () => {
                    const promos = JSON.parse(body);
                    const result = products.map(p => {
                        const promo = promos.find(p => p.id === product.promo);
                        if (promo) {
                            product.promo = promo;
                        }
                    });
                    res.status(200).json(result);
                })
        
            })
            res.status(200).json(productsWithPromo);
        });
    }
}


export default productController;