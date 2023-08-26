import { Router } from 'express'

import { signup, login, getUserName, getUserList } from '../controller/user'
import auth from '../middleware/auth'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/userName/:userId', auth, getUserName)
router.get('/userList/', auth, getUserList)

//router.post('/loginout',userCtr.login);

export default router
