import express from 'express';
import { getAllTheaters, getTheaterById, createTheater, updateTheater, deleteTheater } from '../controllers/theaterController.js';

const router = express.Router();

router.get('/theaters', getAllTheaters);
router.get('/theaters/:id', getTheaterById);
router.post('/theaters', createTheater);
router.put('/theaters/:id', updateTheater);
router.delete('/theaters/:id', deleteTheater);

export default router;
