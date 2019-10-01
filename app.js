const express = require('express');
var app = express();
app.use('/', express.static('public'));
const PORT = process.env.PORT || '8040'
app.listen(PORT,()=>{
    console.log('Server Started on', PORT);
})
