import express from 'express';
import { getShows, getShowFeatures, getShowDates, getShowTimes, getShowSeats, getHallDetails } from '../controllers/showController.js';

const router = express.Router();

router.get('/api/shows', getShows);
router.get('/api/shows/features', getShowFeatures);
router.get('/api/shows/dates', getShowDates);
router.get('/api/shows/times', getShowTimes);
router.get('/api/shows/seats', getShowSeats);
router.get('/api/shows/hall/:showId', getHallDetails);

export default router;
