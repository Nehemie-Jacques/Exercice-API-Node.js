import { Router } from 'express';
import taskController from '../controllers/controller.js'; // Importer le contrôleur de tâches

const router = Router();

router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

export default router;