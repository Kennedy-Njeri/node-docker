const express = require('express')
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { userById, read, update } = require('../controllers/user')




router.get('/user/:userId', requireSignin, read);
router.put('/user/:userId', requireSignin, update);

// every time there is router parameter "userId" in the route, we execute userById method
router.param('userId', userById);


module.exports = router