import { Router } from "express";
import productController from "../controllers/controller.js";

const router = Router();

router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products/promos', productController.getProductsWithPromos);

export default router;