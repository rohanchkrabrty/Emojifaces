const express = require('express')
const faceDetect = require('./faceDetect.js')
var app = express();

var PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Imoji Server running on port " + PORT)
    //faceDetect.loadModels('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/test/images/angry.jpg');
    faceDetect.merge();
});