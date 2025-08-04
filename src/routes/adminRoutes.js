import express from 'express';
import { getAdminDashboard, getManageMoviesPage, getAddMoviePage, getEditMoviePage, getManageTheatersPage, getAddTheaterPage, addTheater, getEditTheaterPage, editTheater, getAddHallPage, addHall, getManageHallsPage, getEditHallPage, editHall, deleteHall } from '../controllers/adminController.js';
import { getAddShowPage, addShows, getManageShowsPage, getEditShowPage, updateShow, deleteShow, getHallsByTheater } from '../controllers/showController.js';
import { getManageUsersPage, getAddUserPage, addUser, getEditUserPage, updateUser, deleteUser } from '../controllers/userController.js';
import { getManageBookingsPage, deleteBooking } from '../controllers/bookingController.js';
import { isLoggedIn, isAdmin, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use('/admin', isLoggedIn, isAdmin);

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

// Show Routes
router.get('/admin/add-show', getAddShowPage);
router.post('/admin/add-show', addShows);
router.get('/admin/shows', getManageShowsPage);
router.get('/admin/edit-show/:id', getEditShowPage);
router.put('/admin/edit-show/:id', updateShow);
router.delete('/admin/shows/:id', deleteShow);

// API route to get halls for a specific theater
router.get('/admin/theaters/:theaterId/halls', getHallsByTheater);
router.get('/api/theaters/:theaterId/halls', getHallsByTheater);

// User management routes
router.get('/admin/users', isLoggedIn, isAdmin, restrictTo('owner', 'supervisor', 'admin'), getManageUsersPage);
router.get('/admin/users/add', isLoggedIn, isAdmin, restrictTo('owner', 'supervisor', 'admin'), getAddUserPage);
router.post('/admin/users/add', isLoggedIn, isAdmin, restrictTo('owner', 'supervisor', 'admin'), addUser);
router.get('/admin/users/edit/:id', isLoggedIn, isAdmin, restrictTo('owner', 'supervisor', 'admin'), getEditUserPage);
router.post('/admin/users/edit/:id', isLoggedIn, isAdmin, restrictTo('owner', 'supervisor', 'admin'), updateUser);
router.delete('/admin/users/delete/:id', isLoggedIn, isAdmin, restrictTo('owner', 'supervisor', 'admin'), deleteUser);

// Booking management routes
router.get('/admin/bookings', isLoggedIn, isAdmin, getManageBookingsPage);
router.delete('/admin/bookings/:id', isLoggedIn, isAdmin, deleteBooking);

export default router;
