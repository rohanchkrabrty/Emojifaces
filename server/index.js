var express = require("express");
var faceDetect = require("./faceDetect.js");
var app = express();

var PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Imoji Server running on port " + PORT);
    faceDetect.print();
});