// const mongoose = require("mongoose");
require('dotenv').config();

const mongoDb = process.env.MONGO_ATLAS_DATABASE;
const { createLogger, transports, format } = require('winston');
require('winston-mongodb');

const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'logs/info.log',
            level: 'info',
            format: format.combine(format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }), format.json())
        }),
        new transports.MongoDB({
            level: 'error',
            db: mongoDb,
            options: {
                useUnifiedTopology: true
            },
            collection: 'logDb',
            format: format.combine(format.timestamp(), format.json())  
        })
    ]
})

module.exports = logger;


// modifying logger
// const { createLogger, format, transports } = require("winston");

// module.exports = createLogger({
//   transports: [
//     new transports.File({
//       filename: "logs/info.log",
//       level: "info",
//       format: format.combine(
//         format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
//         format.align(),
//         format.printf(
//           (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
//         )
//       ),
//     }),
//   ],
// });