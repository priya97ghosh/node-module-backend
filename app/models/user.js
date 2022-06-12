const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  contactNumber: { type: String }, 
  password: { type: String },
  image: { type: String },
  emailToken: { type: String },
  emailTokenExpires: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  is_active: { type: Boolean, default: true },
  verified: { type: String, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  provider: { type: String },
  socialToken: { type: String },
  socialId: { type: String, unique: true},
  loginType: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String }
},
  {
    versionKey: false
  }
);

module.exports = mongoose.model("user", userSchema);