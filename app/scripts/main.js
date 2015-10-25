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
    var files, stickerImg;
    var $photoUploadBtn = document.getElementById('photo-upload'),
    $canvasArea = document.getElementById('canvas-area'),
    $stickerArea = document.getElementById('sticker-area'),
    $addSticker = document.getElementById('add-sticker'),
    $stickerModal = document.getElementById('sticker-modal'),
    $stickerForm = document.getElementById('sticker-form'),
    $stickerInput = document.getElementById('sticker-input'),
    $stickerUploadBtn = document.getElementById('sticker-upload');

    $photoUploadBtn.addEventListener('change', function() {
      files = this.files;
      if(files.length === 1) {
        PHOTOAPP.addImgFileToDom($canvasArea, files[0], true);
      }
    });

    $addSticker.addEventListener('click', function() {
      $stickerForm.reset(); 
      $stickerInput.value = '';
      $stickerModal.style.display = 'block';
    });

    $stickerModal.addEventListener('click', function(e) {
      if(e.target === this) {
        $stickerModal.style.display = 'none';
      }
    });
    $stickerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      files = $stickerUploadBtn.files;
      if($stickerInput.value.trim() && files && files.length === 1) {
        stickerImg = PHOTOAPP.addImgFileToDom($stickerArea, files[0], false);
        stickerImg.height = "150";
        stickerImg.width = "150";
        stickerImg.classList.add('sticker-img');
        $stickerModal.style.display = 'none';
      }
    });
  }
  PHOTOAPP.init();

})(window.PHOTOAPP = window.PHOTOAPP || {});
