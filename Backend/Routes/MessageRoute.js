import express from 'express'
import { Router } from 'express'
import { isAuthenticate } from '../Middlewares/auth.js';
import { getMessage, sendMessage } from '../Controls/MessageControls.js';

const router = express.Router();

router.route('/send/:id').post(isAuthenticate,sendMessage)
router.route('/all/:id').get(isAuthenticate,getMessage)

export default router;