import express from 'express';
import { getHomePage, getBookPage, getMoviesPage, getMoviesApi, addMovie, deleteMovie, updateMovie } from '../controllers/movieController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHomePage);
router.get('/book', isLoggedIn, getBookPage);
router.get('/movies', getMoviesPage);
router.get('/api/movies', getMoviesApi);
router.post('/admin/add-movie', addMovie);
router.post('/admin/edit-movie/:id', updateMovie);
router.delete('/api/movies/:id', deleteMovie);

export default router;
