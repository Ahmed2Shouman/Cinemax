import express from 'express';
import { getBookPage, getOffersPage, getTheatersPage, getContactUsPage, getFaqsPage, getPrivacyPolicyPage, getProfilePage, getSignInPage, getSignUpPage, getCheckoutPage, getBookingSuccessfulPage } from '../controllers/pageController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/book/:id', isLoggedIn, getBookPage);
router.get('/checkout', getCheckoutPage);
router.get('/booking-successful', getBookingSuccessfulPage);
router.get('/offers', getOffersPage);
router.get('/theaters', getTheatersPage);
router.get('/contact-us', getContactUsPage);
router.get('/faqs', getFaqsPage);
router.get('/privacy-policy', getPrivacyPolicyPage);
router.get('/profile', getProfilePage);
router.get('/sign-in', getSignInPage);
router.get('/sign-up', getSignUpPage);

export default router;
