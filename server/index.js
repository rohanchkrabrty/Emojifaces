const express = require('express')
const bodyParser = require("body-parser")
const faceDetect = require('./faceDetect.js')
const { createCanvas, loadImage } = require('canvas')

var PORT = process.env.PORT || 5000;

var app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log("Imoji Server running on port " + PORT)
});
app.get('/', (req, res) => {
    res.send('send POST to /imojify for usage');
});
app.post('/imojify', (req, res, next) => {
    var imageUrl = req.body.url;
    processImage(imageUrl, res);
});

async function processImage(imageUrl, res) {
    if (imageUrl) {
        var details = {
            inputImageUrl: imageUrl,
            outputImageUrl: null
        }
        try {
            console.log("Input Url >> " + imageUrl);
            //load image from URL
            const image = await loadImage(imageUrl);
            //get facedetection results
            var facesData = await faceDetect.detectFacesFromImage(image);
            //if face detected
            if (facesData.length) {
                //prepare the canvas for image edits
                const canvas = createCanvas(image.width, image.height);
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                //draw base image to canvas
                ctx.drawImage(image, 0, 0);

                for (let faceData of facesData) {
                    let face = faceDetect.getSimplifiedFaceDetails(faceData, 16, true);
                    //console.log(face);
                    const emoji = await loadImage("./emojis/" + face.expression + ".png");
                    ctx.drawImage(emoji, face.x, face.y, face.w, face.h);
                }
                details.outputImageUrl = canvas.toDataURL();
                faceDetect.saveFile('merge.jpg', canvas.toBuffer('image/jpeg'))
                console.log("Success")
            }
            else {
                console.log("No Face Found")
            }
        } catch(err) { 
            console.log(err);
        }
        res.send(details);
    }
}