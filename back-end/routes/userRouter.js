const express = require('express')
const upload = require('../middleware/multerConfig')
const userController = require('../controller/userController')
const router = express.Router()
router.post('/register', upload.single('image'), userController.registerUser)
router.post('/user', userController.getUserById)
router.post('/delete', userController.deleteUserById)
router.post('/login', userController.loginUser)
router.post('/verify-otp', userController.verifyOtp)
module.exports = router
