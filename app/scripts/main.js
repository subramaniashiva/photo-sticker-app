'use strict';
(function(PHOTOAPP){
  // Helper function to remove all child nodes of a DOM element
  PHOTOAPP.removeChildNodes = function(node) {
    if(node) {
      while(node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }
    return node;
  }
  PHOTOAPP.isFileAnImage = function(fileObj) {
    var imageType = false,
        matchString = /^image\//;
    if(fileObj && matchString.test(fileObj.type)) {
      imageType = true; 
    }
    return imageType;
  }
  PHOTOAPP.filesToImgElem = function(fileObj) {
    var img, reader;
    if(fileObj) {
      img = document.createElement("img");
      img.classList.add("obj");
      img.file = fileObj;

      reader = new FileReader();
      reader.onload = (function(aImg) { 
        return function(e) { aImg.src = e.target.result; }; 
      })(img);
      reader.readAsDataURL(fileObj);
    }
    return img;
  }
  PHOTOAPP.addImgFileToDom = function(domElem, fileObj, replace) {
    var img;
    if(PHOTOAPP.isFileAnImage(fileObj)) {
      img = PHOTOAPP.filesToImgElem(fileObj);
      if(replace) {
        PHOTOAPP.removeChildNodes(domElem);
        domElem.appendChild(img);
      } else {
        domElem.appendChild(img);
      }
    }
    return img;
  }
  PHOTOAPP.init = function() {
    var files;
    var $photoUploadBtn = document.getElementById('photo-upload'),
    $stickerUploadBtn = document.getElementById('sticker-upload'),
    $canvasArea = document.getElementById('canvas-area'),
    $stickerArea = document.getElementById('sticker-area');

    $photoUploadBtn.addEventListener('change', function() {
      files = this.files;
      if(files.length === 1) {
        PHOTOAPP.addImgFileToDom($canvasArea, files[0], true);
      }
    });

    $stickerUploadBtn.addEventListener('change', function() {
      files = this.files;
      if(files.length === 1) {
        PHOTOAPP.addImgFileToDom($stickerArea, files[0], false);
      }
    });
  }
  PHOTOAPP.init();

})(window.PHOTOAPP = window.PHOTOAPP || {});
