import express from 'express';
import { getOffersPage, getTheatersPage, getContactUsPage, getFaqsPage, getPrivacyPolicyPage, getProfilePage, getSignInPage, getSignUpPage } from '../controllers/pageController.js';

const router = express.Router();

router.get('/offers', getOffersPage);
router.get('/theaters', getTheatersPage);
router.get('/contact-us', getContactUsPage);
router.get('/faqs', getFaqsPage);
router.get('/privacy-policy', getPrivacyPolicyPage);
router.get('/profile', getProfilePage);
router.get('/sign-in', getSignInPage);
router.get('/sign-up', getSignUpPage);

export default router;
