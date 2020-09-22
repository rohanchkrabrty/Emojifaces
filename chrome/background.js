//Background Scripts run whenever a extension is loaded and stays active in the background( might change due to persistance settings ?)
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]);

// Called when the user clicks on the extension
chrome.browserAction.onClicked.addListener(function (tab) {
  sendMessageToActiveTab({ "type": "browserAction" })
});

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
}

function fetchModifiedImage(img, activeTab) {
  //chrome.tabs.sendMessage(activeTab.id, { "message": "fetchedModifiedImage", "response": xhr.responseText });
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