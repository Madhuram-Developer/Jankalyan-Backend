import express from 'express';
import { increaseJaapCountController, getJaapImages } from './jaap.controller.js';

const router = express.Router();

router.post('/increasecount/:deviceID', increaseJaapCountController);
router.get('/jaapimages', getJaapImages);

export default router;