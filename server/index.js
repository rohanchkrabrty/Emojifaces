const express = require('express')
const faceDetect = require('./faceDetect.js')
const { createCanvas, loadImage } = require('canvas')
var app = express();

var PORT = process.env.PORT || 5000

const happy = await loadImage("./graphics/happy.png");
const angry = await loadImage("./graphics/angry.png");
const sad = await loadImage("./graphics/sad.png");
const disgusted = await loadImage("./graphics/disgusted.png");
const neutral = await loadImage("./graphics/neutral.png");
const surprised = await loadImage("./graphics/surprised.png");
const fearful = await loadImage("./graphics/fearful.png");

app.listen(PORT, () => {
    console.log("Imoji Server running on port " + PORT)
    //faceDetect.loadModels('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/test/images/angry.jpg');
    //faceDetect;
    //merge()
});

async function merge() {
    const box = {
        x:94.7-10,
        y:60.5-10,
        w:105.4+20,
        h:128+20
    }
    const image = await loadImage("./out/detection.jpg");
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(image, 0, 0);
    ctx.drawImage(angry, box.x,box.y+((box.h-box.w)/2), box.w, box.w);
    faceDetect.saveFile('merge.jpg', canvas.toBuffer('image/jpeg'))
    console.log("Success")
}