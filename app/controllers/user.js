require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { FCM_KEY } = process.env;
const FCM = require('fcm-node');


const User = require("../models/user");
const { sendEmail } = require('../helpers/mailer')
const verifyToken = require('../middlewares/auth')
const timeline = require('../helpers/timestamp');
const apiResponse = require('../helpers/responseApi');
const firebase = require('../helpers/firebase')
const errorFunction = require("../helpers/errorHandler");
const securePassword = require("../helpers/securePassword");
const Validator  = require("../middlewares/Validator")
const Logger = require('../config/logger')

// signup API
exports.Signup = [ Validator('signup'), async  (req, res, next) => {
  try {
    // console.log("body", req.body)
    // const validate = await  Validation(req.body);
    
    // // throw validation errors
    // if (!validate) {
    //   return res.send({
    //     status: 400,
    //     error: error.details[0].message
    //   });
    // }
    res.json({ signup: req.body })
    const isEmailExist = await User.findOne({ email: req.body.email });

    // throw error when email already registered
    if (isEmailExist)
      return res.status(400).json({ error: "Email already exists" });

    // hash the password
    const hashedPassword = await securePassword(req.body.password);
    const code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    const expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now
    const sendCode = await sendEmail(req.body.email, code);
    if (sendCode) {
      return res.status(500).send("Couldn't send verification email.");
    }
    req.body.emailToken = code;
    req.body.emailTokenExpires = new Date(expiry);
    req.body.password = hashedPassword;

    let date_time = timeline.timestamp();
    req.body.createdAt = date_time;

    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      contactNumber: req.body.contactNumber,
      image: req.body.image,
      is_active: req.body.is_active,
    });

    const savedUser = await newUser.save();
    res.json({ error: null, data: { userId: savedUser._id } });

    if (newUser) {
      return res.send({
        status: 201,
        error: true,
        newUser: newUser,
        message: "User Created",
      });
    } else {
      return res.send({
        status: 403,
        error: true,
        message: "Error Creating User"
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      error: true,
      message: "Error Adding user"
    });
  }
}]

  // signin API
exports.Signin =  async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    console.log(req.body);

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is require");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    var result = firebase.sentNotificationMultiple('shdjhfwhjefwjefh', 'Test', 'data');
    console.log(result);

    // throw error if user not found
    if (!user) {
      res.status(404).json(
        {
          "error": true,
          "message": "User not found.. please check again"
        }
      )
    }
    //2. Throw error if account is not activated
    if (!user.active) {
      return res.status(400).json({
        error: true,
        message: "Please verify your email"
      });
    }
    console.log("user", user);
    console.log("password", password)

    // verify password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h", });
      const refreshToken = jwt.sign({ user_id: user._id, email }, process.env.REFRESH_TOKEN_KEY, { expiresIn: "1h", });

      // save user token
      user.token = token;
      user.refreshToken = refreshToken;

      console.log('Token', token)
      console.log("refresh token", refreshToken);
      // user
      return apiResponse.successResponse(res, "Login Successful", user)
      // res.status(200).json({
      //   user: user,
      //   message: "Loggedin success!!"
      // }) 
    }
    else if (password === password) {
      return res.send({
        status: 404,
        error: true,
        message: "Incorrect password!!",
      });
    }
    // res.status(400).send("Invalid Credentials");

    var data = { email };
    console.log("data", data)

    if (userId.user_firebase_id) {
      var result = firebase.sentNotificationMultiple(user_id.user_firebase_id, title, data);
    }
    console.log("result", result);
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
      message: "We couldn't sign you in. Please try again"
    });
  };
}


  // verify API
  exports.Verify = [
    verifyToken,
    async function (req, res) {
      // console.log("request", req)
      try {
        const user = await User.findOne({ _id: req.user.user_id });
        if (!user) {
          return res.send({
            status: 404,
            message: "User does not  exists"
          });
        }
        // Step 3 - Update user verification status to true
        user.verified = true;
        await user.save();
        return res.send({
          status: 200,
          message: "Your account is verified"
        });

      } catch (error) {
        return res.status(500).send(error)
      }
    }
  ]

  // refresh token API
  exports.RefreshToken = [verifyToken, async (req, res) => {
    // const user = { _id: user._id, email: user.email };
    const refreshToken = req.body.refreshToken
    console.log("refreshToken", refreshToken);
    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY,
      (err, decoded) => {
        if (err) {
          // Wrong Refesh Token
          return res.status(406).json({ message: 'Unauthorized' });
        }
        else {
          const token = jwt.sign({ user_id: decoded._id, email: decoded.email }, process.env.TOKEN_KEY, { expiresIn: "1h", })
          console.log("token", token);
          const refreshToken = req.body.refreshToken
          return res.status(200).json(
            {
              "message": "Token refreshed successfully",
              "token": token,
              "refreshToken": refreshToken
            }
          )
        }
      })
  }]

  // social login API
  exports.SocialLogin = [async (req, res) => {
    try {
      //get input
      const { email, provider, socialToken, socialId, loginType } = req.body;
      console.log(req.body);
      // Validate user input
      if (!(provider && socialToken && socialId)) {
        res.status(400).send("All input are require.");
      }
      // Check if user exist in our database
      const SocialId = await User.find({ socialId: socialId });
      console.log("This is social id", SocialId)

      // throw error if user not found
      if (!SocialId) {
        res.status(404).json(
          {
            "error": true,
            "message": "User Not Found."
          }
        )
      }
      let date_time = timeline.timestamp();
      req.body.createdAt = date_time;

      //check data
      if (provider === 'google') {
        const userData = {
          email: email,
          provider: provider,
          socialToken: socialToken,
          // socialId: socialId,
          loginType: loginType
        }
        return apiResponse.successResponseWithData(res, "Login Success..", userData);
      }

    } catch (error) {
      console.log("Login error", error)
      return res.status(500).json({
        error: true,
        message: "Couldn't login. Please try again."
      })
    }

  }]
  // update social login API
  exports.UpdateSocial = [async (req, res) => {
    const { socialToken, socialId } = req.body;

    try {
      const update = await User.findById(req.params.id);
      if (!update) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      update.socialToken = socialToken || update.socialToken;
      update.socialId = socialId || update.socialId;

      update.updatedAt = timeline.timestamp();

      await update.save();

      return res.status(200).json({
        success: true,
        message: "Your changes have been successfully saved!",
        update: update
      })

    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error
      })
    }
  }]
  // Get all API
  exports.GetAll = async (req, res) => {
    try {
      // console.log(req);
      const user = await User.find({});
      console.log(user);
      return res.json(user);
    } catch (err) {
      res.json({ message: err.message })
    }
  };

  // Get By Id API
  exports.GetById = async (req, res) => {
    try {
      // console.log(req);
      const user = await User.findById(req.query.userId);
      // console.log(user);
      return res.json(user);
    } catch (err) {
      res.json({ message: err.message })
    }
  }

  // Forgot Password API
  exports.ForgotPassword = [async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.send({
          status: 400,
          error: true,
          message: "Cannot be processed",
        });
      }
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        return res.send({
          success: true,
          message: "If that email address is in our database, we will send you an email to reset your password",
        });
      }
      let code = Math.floor(100000 + Math.random() * 900000);
      let response = await sendEmail(user.email, code);
      if (response) {
        return res.send({
          status: 400,
          error: true,
          message: "Couldn't send mail. Please try again later.",
        });
      }
      let expiry = Date.now() + 60 * 1000 * 15;
      user.resetPasswordToken = code;
      user.resetPasswordExpires = expiry; // 15 minutes
      await user.save();

      return res.send({
        success: true,
        message: "If that email address is in our database, we will send you an email to reset your password",
      });
    } catch (error) {
      console.error("forgot-password-error", error);
      return res.send({
        status: 500,
        error: true,
        message: error.message,
      });
    }
  }]

  // // reset password API
  exports.ResetPassword = [async (req, res) => {
    try {
      console.log(req.body);
      const { token, newPassword, confirmPassword } = req.body;
      if (!token || !newPassword || !confirmPassword) {
        return res.status(403).json({
          error: true,
          message: "Couldn't process request. Please provide all mandatory fields",
        });
      }
      const user = await User.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.send({
          error: true,
          message: "Password reset token is invalid or has expired.",
        });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          error: true,
          message: "Passwords didn't match",
        });
      }
      const hash = await User.hashPassword(req.body.newPassword);
      user.password = hash;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = "";
      await user.save();
      return res.send({
        success: true,
        message: "Password has been changed",
      });
    } catch (error) {
      console.error("reset-password-error", error);
      return res.send({
        status: 500,
        error: true,
        message: error.message,
      });
    }
  }]

