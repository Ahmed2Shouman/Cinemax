import express from 'express';
import { getAdminDashboard, getManageMoviesPage, getAddMoviePage, getEditMoviePage, getManageTheatersPage, getAddTheaterPage, addTheater, getEditTheaterPage, editTheater, getAddHallPage, addHall, getManageHallsPage, getEditHallPage, editHall, deleteHall } from '../controllers/adminController.js';

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
router.get('/admin/halls', (req, res) => res.redirect('/admin/theaters'));
router.get('/admin/theaters/:id/add-hall', getAddHallPage);
router.post('/admin/theaters/:id/add-hall', addHall);
router.get('/admin/theaters/:id/halls', getManageHallsPage);
router.get('/admin/halls/:id/edit', getEditHallPage);
router.put('/admin/halls/:id', editHall);
router.delete('/admin/halls/:id', deleteHall);

export default router;
