import express from 'express';
import { getAdminDashboard, getManageMoviesPage, getAddMoviePage, getEditMoviePage } from '../controllers/adminController.js';

const router = express.Router();

router.get('/admin', getAdminDashboard);
router.get('/admin/movies', getManageMoviesPage);
router.get('/admin/add-movie', getAddMoviePage);
router.get('/admin/edit-movie/:id', getEditMoviePage);

export default router;
