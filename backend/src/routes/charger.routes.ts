import express from 'express'
import { 
    createChargingStation,
    getAllChargingStations,
    getSingleStation,
    updateStation,
    deleteStation
 } from '../controllers/charging.controller'

import { authenticate } from '../middlewares/auth.middleware'

const router = express.Router();

// protected routes
router.post('/', authenticate, createChargingStation);
router.put('/:id', authenticate, updateStation)
router.delete('/:id', authenticate, deleteStation);

// public routes
router.get('/', getAllChargingStations);
router.get('/:id', getSingleStation)

export default router;


