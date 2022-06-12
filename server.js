require("dotenv").config();
const express = require("express");
const createHttpError = require('http-errors')

const app = express();
app.use(express.json())

const logger = require("./app/config/logger");
const connectDB = require('./app/config/database')
const port = process.env.PORT;

//logger
app.use((req, res, next) => {
  logger.info(req.body);
  
  let oldSend = res.send;
  res.send = function (data) {
    logger.info(JSON.stringify(data));
    oldSend.apply(res, arguments);
  }
  next();
})

//* Catch HTTP 404 
app.use((req, res, next) => {
  next(createHttpError(404));
})

const UserRoutes = require("./app/routes/user")
// const userProfile = require('./app/routes/userProfile')
// const banner = require('./app/routes/banner')

// console.log("userRoute", userRoute);
// console.log("userProfile", userProfile);
// console.log("banner", banner)

app.use('/uploads', express.static('uploads'))

app.use("/user", UserRoutes)
// app.use('/user-profile', userProfile);
// app.use('/banner', banner)



app.listen(port, () => {
  connectDB();
  console.log(`server is up and running on ${port}`);
   // logger.info(`server is up and running on ${port}`); --- we can check in server.log file
});
