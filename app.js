const express = require('express');
var app = express();
app.use('/', express.static('public'));
app.listen(process.env.port || '1234',()=>{
    console.log('Server Start');
})
