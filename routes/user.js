const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllerUser=require("../controllers/user.js");

router.route("/signup")
.get(controllerUser.signupRender)
.post(wrapasync(controllerUser.signup));

router.route("/login")
.get(controllerUser.loginRender)
.post(saveRedirectUrl, passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}), controllerUser.login
);

//logout
router.get("/logout",controllerUser.logout);

module.exports= router;