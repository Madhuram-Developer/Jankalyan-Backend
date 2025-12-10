import express from 'express';
import { getCategoriesController } from './categories.controller.js';

const router = express.Router();

router.get('/', getCategoriesController);

export default router;