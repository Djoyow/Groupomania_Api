import { Router } from 'express'

import { getPostes, getOnePost, creatPost, updatePost, deletePost, likePost } from '../controller/post'
import auth from '../middleware/auth'
import multer from '../middleware/multer-config'
const router = Router()

router.get('/', auth, getPostes)
router.get('/:id', auth, getOnePost)
router.post('/', auth, multer, creatPost)
router.put('/:id', auth, multer, updatePost)
router.delete('/:id', auth, deletePost)
router.post('/like/', auth, likePost)
//router.post('/:id/like',auth,sauceCtr.likeSauce);

export default router
