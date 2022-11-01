const express = require('express');

const postCtr = require('../controller/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

router.get('/',auth,postCtr.getPostes);
router.get('/:id',auth,postCtr.getOnePost);
router.post('/',auth,multer,postCtr.creatPost);
router.put('/:id',auth,multer,postCtr.updatePost);
router.delete('/:id',auth,postCtr.deletePost);
router.post('/like/',auth,postCtr.likePost);
//router.post('/:id/like',auth,sauceCtr.likeSauce);


module.exports=router;
