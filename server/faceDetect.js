const faceapi = require("face-api.js")
const canvas = require("canvas")
const fs = require("fs")
const path = require("path")

// monkey pathing the faceapi canvas
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

// simple utils to save files
const baseDir = path.resolve(__dirname, './out')
function saveFile(fileName, buf) {
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir)
    }
    // this is ok for prototyping but using sync methods
    // is bad practice in NodeJS
    fs.writeFileSync(path.resolve(baseDir, fileName), buf)
}
Promise.all([
    // load weights/models
    faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
    faceapi.nets.faceExpressionNet.loadFromDisk('./models')
]).then(response => console.log("Models Loaded"));

async function loadModels(url) {
    // load the image
    const image = await canvas.loadImage(url)
    //detect face with landmarks and expressions
    const results = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceExpressions()

    const box1 = results[0].detection.box;
    const box2 = results[0].alignedRect.box;
    const expression = results[0].expressions.asSortedArray()[0].expression;
    console.log(expression)
    // create a new canvas and draw the detection and landmarks
    const out = faceapi.createCanvasFromMedia(image)
    //faceapi.draw.drawDetections(out, results.map(res => res.detection))
    //faceapi.draw.drawFaceExpressions(out, results)
    // save the new canvas as image
    //new faceapi.draw.DrawBox(box1, {lineWidth: 2, boxColor: 'rgba(34, 99, 71, 1)'}).draw(out);
    //new faceapi.draw.DrawBox(box2, {lineWidth: 2, boxColor: 'rgba(227, 99, 71, 1)'}).draw(out);

    saveFile('detection.jpg', out.toBuffer('image/jpeg'))
    console.log('done, saved results to out/faceLandmarkDetection.jpg')
    //console.log(out.toDataURL())
}
module.exports = { loadModels , saveFile }