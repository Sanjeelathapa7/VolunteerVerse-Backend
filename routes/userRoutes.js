// import
const router = require('express').Router();
const userController = require("../controllers/userController");

// register api
router.post('/register', userController.createUser)

//login api
router.post('/login', userController.loginUser)


// exporting
module.exports = router;