import express from 'express'
import { Router } from 'express'
import { isAuthenticate } from '../Middlewares/auth.js';
import { addComment, AddnewPost, bookmarkPost, deletePost, dislikePost, getAllpost, getCommentbyEachPost, getUserPost, likePost } from '../Controls/PostControls.js';
import { upload } from '../Utils/multer.js';

const router = express.Router();

router.route('/addPost').post(isAuthenticate,upload.single('image'),AddnewPost);
router.route('/all').get(isAuthenticate,getAllpost);
router.route('/userpost/all').get(isAuthenticate,getUserPost)
router.route('/:id/like').get(isAuthenticate,likePost)
router.route('/:id/dislike').get(isAuthenticate,dislikePost)
router.route('/:id/comment').post(isAuthenticate,addComment)
router.route('/:id/comment/all').get(isAuthenticate,getCommentbyEachPost);
router.route('/delete/:id').delete(isAuthenticate,deletePost)
router.route('/:id/bookmark').get(isAuthenticate,bookmarkPost)

export default router;
