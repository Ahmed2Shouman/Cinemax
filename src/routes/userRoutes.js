import express from 'express';
import {
    getManageUsersPage,
    getAddUserPage,
    addUser,
    getEditUserPage,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('owner', 'supervisor'));

router.get('/', getManageUsersPage);
router.get('/add', restrictTo('owner', 'supervisor'), getAddUserPage);
router.post('/add', restrictTo('owner', 'supervisor'), addUser);
router.get('/edit/:id', getEditUserPage);
router.post('/edit/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;
