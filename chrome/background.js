//Background Scripts run whenever a extension is loaded and stays active in the background( might change due to persistance settings ?)
var angry = new Image();
var disgusted = new Image();
var fearful = new Image();
var happy = new Image();
var neutral = new Image();
var sad = new Image();
var surprised = new Image();
angry.src = chrome.extension.getURL("emojis/angry.png");
disgusted.src = chrome.extension.getURL("emojis/disgusted.png");
fearful.src = chrome.extension.getURL("emojis/fearful.png");
happy.src = chrome.extension.getURL("emojis/happy.png");
neutral.src = chrome.extension.getURL("emojis/neutral.png");
sad.src = chrome.extension.getURL("emojis/sad.png");
surprised.src = chrome.extension.getURL("emojis/surprised.png");
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]);

// Called when the user clicks on the extension
chrome.browserAction.onClicked.addListener(function (tab) {
  //create connection on 
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    addMessageListener(port);
    port.postMessage({ type: "start" });
  });
});
function addMessageListener(port) {
  port.onMessage.addListener(function (message) {
    if (message.type == "fetchModifiedImage") {
      fetchModifiedImage(message.imgSrc, port);
    }
  });
}
/*
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (message) {
    if (message.type == "test") {
      alert("test");
      port.postMessage({type :"test2"});
    }
  });
});
/*
//listens for incoming messages
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case 'fetchModifiedImage':
      break;
  }
});
function sendMessageToActiveTab(message) { // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, message);
  });
}*/

function fetchModifiedImage(imgSrc, port) {
  //chrome.tabs.sendMessage(activeTab.id, { "message": "fetchedModifiedImage", "response": xhr.responseText });
  var img = new Image();
  img.src = imgSrc;

  img.onload = async function () {
    const canvas = faceapi.createCanvasFromMedia(img);
    const ctx = canvas.getContext('2d')
    //const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceExpressions();
    //faceapi.draw.drawDetections(canvas, detections);
    
    if (detections.length) {
      for (let detection of detections) {
        //draw emoji for each face
        var face = getSimplifiedFaceDetection(detection, 5, true)
        ctx.drawImage(window[face.expression], face.x, face.y, face.w, face.h);
      }
      port.postMessage({ "type": "fetchedModifiedImage", "imgSrc": imgSrc, "newImgSrc": canvas.toDataURL() })
    }
    else
      port.postMessage({ "type": "fetchedModifiedImage", "imgSrc": imgSrc, "newImgSrc": null })
  }
}

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