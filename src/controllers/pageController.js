export const getOffersPage = (req, res) => {
  res.render('pages/offers');
};

import * as theaterModel from '../models/theaterModel.js';

export const getTheatersPage = async (req, res) => {
  try {
    const theaters = await theaterModel.getAllTheaters();
    res.render('pages/theaters', { theaters });
  } catch (error) {
    res.status(500).send('Error loading theaters page');
  }
};

export const getContactUsPage = (req, res) => {
  res.render('pages/contact-us');
};

export const getFaqsPage = (req, res) => {
  res.render('pages/faqs');
};

export const getPrivacyPolicyPage = (req, res) => {
  res.render('pages/privacy');
};

export const getProfilePage = (req, res) => {
  res.render('pages/profile');
};

export const getSignInPage = (req, res) => {
  res.render('pages/login');
};

export const getSignUpPage = (req, res) => {
  res.render('pages/signup');
};
