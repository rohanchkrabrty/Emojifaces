var express = require("express");
var app = express();
var PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log("Server running on port "+PORT);
});