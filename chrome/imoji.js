console.log("Imoji.js Loaded");
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    //on extension click
    if (request.message == "browserAction") {
      console.log("Fetching Images");
      fetchAllImages();
      fetchImagesAfterLoad();
    }
    if (request.message == "fetchedModifiedImage") {
      if (request.response != null) {
        const responseJson = JSON.parse(request.response);
        if (responseJson.outputImageUrl != null) {
          //find img with inputsrc and then change img src to output
          var images = document.getElementsByTagName("img");
          for (let img of images) {
            if(img.src == responseJson.inputImageUrl){
              img.src = responseJson.outputImageUrl;
              console.log(img);
              break;
            }
          }

        }
      }
    }
  }
);
function fetchAllImages() {
  var images = document.getElementsByTagName("img");
  for (let img of images) {
    if (isImageValid(img)) {
      img.setAttribute('is-imoji', 'unknown');
      //send to server
      chrome.runtime.sendMessage({ "message": "fetchModifiedImage", "url": img.src });
      
    }
  }
};
function isImageValid(img) {
  //checks if image is valid for processing
  if (img.src.length < 2)
    return false;
  if (img.hasAttribute('is-imoji'))
    return false;
  //check if image is of appropiate size
  if (img.width <= 40 && img.height <= 40)
    return false;
  return true;
}
function fetchImagesAfterLoad() {
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