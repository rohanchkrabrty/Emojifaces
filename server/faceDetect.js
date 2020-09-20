const faceapi = require("face-api.js")
const canvas = require("canvas")
const fs = require("fs")
const path = require("path")

// monkey patching the faceapi canvas
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
    //load weights/models
    //faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
    faceapi.nets.tinyFaceDetector.loadFromDisk('./models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
    faceapi.nets.faceExpressionNet.loadFromDisk('./models')
]).then(response => console.log("Models Loaded"));

async function detectFacesFromImage(image) {
    //detect face with landmarks and expressions
    const results = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    return(results)
}
function getSimplifiedFaceDetails(faceData, offset, makeBoxSquare){
    //offset increases/decreases the bounding box of the face result
    //makeBoxSquare - if true will resize the bounding box to a square for easier scaling
    var face = {
        x: faceData.detection.box.x - (offset/2),
        y: faceData.detection.box.y - (offset/2),
        w: faceData.detection.box.width + offset,
        h: faceData.detection.box.height + offset,
        expression : faceData.expressions.asSortedArray()[0].expression
    }
    if(makeBoxSquare){
        if(face.h >= face.w){
            face.y += (face.h-face.w)/2;
            face.h = face.w;
        }else{
            face.x += (face.w-face.h)/2;
            face.w = face.h;
        }
    }
    return face;
}
module.exports = { detectFacesFromImage , saveFile , getSimplifiedFaceDetails }