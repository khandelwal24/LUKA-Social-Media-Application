import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import { Router } from 'express'
import 'dotenv/config'
import { editProfile, followUnfollow, getProfile, Login, Logout, Register, SuggestedUser } from '../Controls/UserControls.js'
import { isAuthenticate } from '../Middlewares/auth.js'
import cloudinary from '../Utils/CloudinaryP.js'
import { upload } from '../Utils/multer.js'

const router = express.Router();


router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/logout').get(Logout);
router.route('/:id/profile').get(isAuthenticate,getProfile);
router.route('/profile/edits').post(isAuthenticate,upload.single('profilePic'),editProfile);
router.route('/Suggested_Users').get(isAuthenticate,SuggestedUser);
router.route('/follow_unfollow/:id').post(isAuthenticate,followUnfollow);

export default router