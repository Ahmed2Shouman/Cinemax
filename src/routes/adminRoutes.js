import express from 'express';
import { getAdminDashboard, getManageMoviesPage, getAddMoviePage, getEditMoviePage, getManageTheatersPage, getAddTheaterPage, addTheater, getEditTheaterPage, editTheater } from '../controllers/adminController.js';

const router = express.Router();

router.get('/admin', getAdminDashboard);
router.get('/admin/movies', getManageMoviesPage);
router.get('/admin/add-movie', getAddMoviePage);
router.get('/admin/edit-movie/:id', getEditMoviePage);
router.get('/admin/theaters', getManageTheatersPage);
router.get('/admin/add-theater', getAddTheaterPage);
router.post('/admin/add-theater', addTheater);
router.get('/admin/edit-theater/:id', getEditTheaterPage);
router.put('/admin/edit-theater/:id', editTheater);

export default router;
