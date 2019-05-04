const express = require('express');
var app = express();
app.use('/', express.static('public'));
app.listen('1234',()=>{
    console.log('Server Start');
})