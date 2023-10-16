const express = require('express')
const {register,login,getMe,forgotPassword,resetPassword,updateUserDetails, updatePassword} = require('../controllers/auth')
const {protect} = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me',protect,getMe)
router.put('/updateuserdetails',protect,updateUserDetails)
router.put('/updatepassword',protect,updatePassword)
router.post('/forgotpassword',forgotPassword)
router.put('/resetpassword/:resettoken',resetPassword)


module.exports = router 