const express = require('express');
const app = express()
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('./db/mongoose')

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');


require('dotenv').config();

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());



// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', taskRoutes);




const port = process.env.PORT || 6000



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})