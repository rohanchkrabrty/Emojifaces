const video1 = document.getElementById('video1')
const video2 = document.getElementById('video2')
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video1.srcObject = stream;
            video2.srcObject = stream;
        })
        .catch(function (err) {
            console.log("Something went wrong!");
        });
}
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

video1.addEventListener('play', () => {
    console.log("Working")
    const canvas1 = faceapi.createCanvasFromMedia(video1)
    const canvas2 = faceapi.createCanvasFromMedia(video2)
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const displaySizeofVideo1 = { width: video1.width, height: video1.height }
    const displaySizeofVideo2 = { width: video2.width, height: video2.height }
    document.getElementById('canvas').append(canvas1)
    document.getElementById('canvas').append(canvas2)
    faceapi.matchDimensions(canvas1, displaySizeofVideo1)
    faceapi.matchDimensions(canvas2, displaySizeofVideo2)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video1, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySizeofVideo1)
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
        ctx2.clearRect(0, 0, canvas1.width, canvas1.height)
        faceapi.draw.drawDetections(canvas1, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas1, resizedDetections)
        for (let resizedDetection of resizedDetections) {
            //draw emoji for each face
            var face = getSimplifiedFaceDetection(resizedDetection, 5, true)
            const emoji = document.getElementById(face.expression);
            ctx2.drawImage(emoji, face.x, face.y, face.w, face.h);
        }
    }, 100)
})
function getSimplifiedFaceDetection(faceData, offset, makeBoxSquare) {
    //offset increases/decreases the bounding box of the face result
    //makeBoxSquare - if true will resize the bounding box to a square for easier scaling
    var face = {
        x: faceData.detection.box.x - (offset / 2),
        y: faceData.detection.box.y - (offset / 2),
        w: faceData.detection.box.width + offset,
        h: faceData.detection.box.height + offset,
        expression: faceData.expressions.asSortedArray()[0].expression
    }
    if (makeBoxSquare) {
        if (face.h >= face.w) {
            face.y += (face.h - face.w) / 2;
            face.h = face.w;
        } else {
            face.x += (face.w - face.h) / 2;
            face.w = face.h;
        }
    }
    return face;
}