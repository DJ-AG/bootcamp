const express = require('express')
const {register,login,getMe,forgotPassword,resetPassword,updateUserDetails, updatePassword} = require('../controllers/auth')

const {protect} = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post('/forgotpassword',forgotPassword)

router.put('/resetpassword/:resettoken',resetPassword)

router.use(protect)

router.get('/me',getMe)

router.put('/updateuserdetails',updateUserDetails)

router.put('/updatepassword',updatePassword)



module.exports = router 