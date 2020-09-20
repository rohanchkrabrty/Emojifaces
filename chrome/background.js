// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { "message": "browserAction" });
  });
});

//listens for incoming messages
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "fetchModifiedImage") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        fetchModifiedImage(request.url,activeTab);
      });
    }
  }
);

function fetchModifiedImage(url, activeTab) {
  var xhr = new XMLHttpRequest();
  const json = {
    "url": url
};
  xhr.open("POST", "http://localhost:5000/imojify", true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        chrome.tabs.sendMessage(activeTab.id, { "message": "fetchedModifiedImage", "response": xhr.responseText });
      } else {
        chrome.tabs.sendMessage(activeTab.id, { "message": "fetchedModifiedImage", "response": null });
      }
    }
  };
  xhr.onerror = function (e) {
    chrome.tabs.sendMessage(activeTab.id, { "message": "fetchedModifiedImage", "response": null });
  };
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(json));
}
