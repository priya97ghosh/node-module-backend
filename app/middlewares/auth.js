const jwt = require('jsonwebtoken')
const config = process.env;
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.body.refreshToken || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    console.log("decoded", decoded)
  } catch (err) {
    console.log("error", err);
    return res.status(401).send("Invalid Token");
  }
  return next();
};
module.exports = verifyToken;


//for cookie store
// const jwt = require('jsonwebtoken')
// const config = process.env;
// require("dotenv").config();

// const verifyToken = (req, res, next) => {
//   // const token = req.body.token || req.body.refreshToken || req.query.token || req.headers["x-access-token"];
//   const token = req.cookies.token

//   if (!token) {
//     return res.status(403).send("Token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user = decoded;
//     console.log("decoded", decoded)
//   } catch (err) {
//     console.log("error", err);
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };
// module.exports = verifyToken;
