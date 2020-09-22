console.log("Imoji.js Loaded");

//message listener
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case 'browserAction':
      fetchAllImages();
      fetchImagesAfterLoad();
      break;
    case 'fetchedModifiedImage':
      break;
  }
});

function fetchAllImages() { //fetches all images - used during start
  var images = document.getElementsByTagName("img");
  for (let img of images) {
    if (isImageValid(img)) {
      img.classList.add("imoji");
      //send to server
      chrome.runtime.sendMessage({ "type": "fetchModifiedImage", "img": img });

    }
  }
};

function fetchImagesAfterLoad() { //fetch images after DOM load
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      Array.from(mutation.addedNodes)
        .filter(node => node.tagName === 'IMG')
      {
        fetchAllImages();
      };
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

function isImageValid(img) { //checks if image is valid for processing
  if (img.src.length < 2)
    return false;
  if (img.classList.contains("imoji"))
    return false;
  //check if image is of appropiate size
  if (img.width <= 40 && img.height <= 40)
    return false;
  return true;
}