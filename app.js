const express = require('express');
const auth = require('./middleware/auth');
const path = require('path');
const cors = require('cors')

const userRoute = require('./routes/user');
const postRoute=require('./routes/post');

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.json()); // give access to the body 

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth',userRoute); 
app.use('/api/post',postRoute);



module.exports = app;