const express = require('express');

const userCtr = require('../controller/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup',userCtr.signup);
router.post('/login',userCtr.login);
router.get('/userName/:userId',auth,userCtr.getUserName);
router.get('/userList/',auth,userCtr.getUserList);

//router.post('/loginout',userCtr.login);

module.exports=router;
