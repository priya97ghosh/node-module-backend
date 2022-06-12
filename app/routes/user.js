const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
// const Uservalidator = require("../../validations/user")

//Defining endpoints
router.post("/signup", UserController.Signup);
// router.post("/signin", UserController.Signin);
// router.post("/refresh-token", UserController.RefreshToken);
// router.post('/social-login', UserController.SocialLogin)
// router.get('/get-all', UserController.GetAll);
// router.get("/get-by-id", UserController.GetById);
// router.patch('/verify', UserController.Verify);
// router.patch("/forgot", UserController.ForgotPassword);
// router.patch("/reset", UserController.ResetPassword);
// router.post("/send-notification", UserController.Notification)


module.exports = router;