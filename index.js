const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const logger = require('morgan');
const path = require('path');
const fileUpload = require("express-fileupload");
const user = require("./user")
const absensi = require("./absensi")

require('dotenv').config();
const PORT = process.env.PORT || 3012;
const base_url = process.env.base_url;

const app = express();
app.use(fileUpload());
app.use(express.json())// add this line
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin','*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

app.use(cors())
app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));


app.get("/", (req, res) => {
    res.send({
        message: "🚀 API Modik v2.0"
    });
});


// ============================================= ROUTING HERE =========================================

// ============================== User =======================================

// app.post('/api/V2/modik/user', user.create);
app.post('/api/V2/modik/login', user.login);
// app.get('/api/V2/modik/user', user.read);
// app.get('/api/V2/modik/user/:id', user.read_by_id);
// app.get('/api/V2/modik/user/mmsi/:mmsi', user.read_by_mmsi);
// app.put('/api/V2/modik/user/:id', user.update);
// app.delete('/api/V2/modik/user/:id', user.delete_);
// ==========================================================================

// ============================== Absensi ===================================
app.post('/api/V2/modik/absensi/:id', absensi.create);
app.get('/api/V2/modik/absensi/:id', absensi.read);


// ==========================================================================




app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});
