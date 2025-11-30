import express from 'express';
import {
    addTruck,
    getAllTrucks,
    updateTruck,
    deleteTruck,
    uploadTruckImage
} from '../controllers/truckController.js';

import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/add', addTruck);
router.get('/all', getAllTrucks);
router.put('/update/:id', updateTruck);
router.delete('/delete/:id', deleteTruck);

router.post(
    "/upload-image/:id",
    upload.single("truckImage"),
    uploadTruckImage
);

export default router;
