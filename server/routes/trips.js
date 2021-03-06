import express from 'express';
import Trip from '../controllers/trips';
import { validateTrip, validateParam } from '../middlewares/inputValidation';
import { validateToken, checkAdmin } from '../middlewares/userVerification';

const router = express.Router();

router.post('/', [validateTrip, validateToken, checkAdmin], Trip.createTrip);
router.get('/', [validateToken], Trip.findAllTrips);
router.get('/:tripId', [validateParam, validateToken], Trip.findATrip);
router.patch('/:tripId', [validateParam, validateToken, checkAdmin], Trip.updateTripStatus);


export default router;
