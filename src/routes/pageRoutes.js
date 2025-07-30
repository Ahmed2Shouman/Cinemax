import express from 'express';
import { getBookPage, getTheatersPage, getContactUsPage, getFaqsPage, getPrivacyPolicyPage, getProfilePage, getSignInPage, getSignUpPage, getCheckoutPage, getBookingSuccessfulPage } from '../controllers/pageController.js';
import { getMyBookingsPage } from '../controllers/bookingController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/book/:id', isLoggedIn, getBookPage);
router.get('/checkout', getCheckoutPage);
router.get('/booking-successful', getBookingSuccessfulPage);
router.get('/theaters', getTheatersPage);
router.get('/contact-us', getContactUsPage);
router.get('/faqs', getFaqsPage);
router.get('/privacy-policy', getPrivacyPolicyPage);
router.get('/profile', isLoggedIn, getProfilePage);
router.get('/sign-in', getSignInPage);
router.get('/sign-up', getSignUpPage);
router.get('/mybookings', isLoggedIn, getMyBookingsPage);

export default router;
