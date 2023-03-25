const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

//data import only once
// const User = require('./models/User')
// const {dataUser} = require('./data')


// configuration
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
// app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
const corsOptions = require('./config/corsOptions')
app.use(cors(corsOptions))

// for logging requests
const {logger} = require('./middleware/logger')
app.use(logger)

// routes
app.use('/api/v1/client', require('./routes/clientRoutes'))
app.use('/api/v1/general', require('./routes/generalRoutes.js'))
app.use('/api/v1/management', require('./routes/managementRoutes.js'))
app.use('/api/v1/sales', require('./routes/salesRoutes.js'))

//setting up mongoose
const PORT = process.env.PORT || 4000
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
connectDB();

//error handling
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler)

mongoose.connection.once('open', ()=>{
    console.log("connected to mongoBD")
    app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

    //only add data one time
    //uncommect below to insert data without bcrypt password
    // User.insertMany(dataUser)

    //uncommect below to insert data with bcrypt password
    // dataUser.map(async(user) => {
    //     await User.create(user)
    // });
})

//in server error case
const {logEvents} = require('./middleware/logger');
mongoose.connection.on('error', err =>{
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrorlog.log')
});