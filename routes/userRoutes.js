// import
const router = require('express').Router();
const userController = require("../controllers/userController");

// register api
router.post('/register', userController.createUser)

//login api
router.post('/login', userController.loginUser)

//forget api 
router.post('/resetpassword', userController.resetPassword)
router.post('/resetcode', userController.verifyResetCode)
router.post('/updatepassword', userController.updatePassword)





// exporting
module.exports = router;