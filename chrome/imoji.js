console.log("Imoji.js Loaded");
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.browserAction) {
        fetchImages();
      }
    }
);
function fetchImages(){
    console.log("Fetching Images");
    var images = document.getElementsByTagName("img");
    for(let image of images){
        console.log(image.src);
    }
};