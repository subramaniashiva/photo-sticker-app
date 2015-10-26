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
      img.file = fileObj;
      img.src = window.URL.createObjectURL(fileObj);
      img.onload = function() {
        window.URL.revokeObjectURL(this.src);
      }
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
    $stickerUploadBtn = document.getElementById('sticker-upload'),
    $stickerTemplate = document.getElementById('sticker-template');

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
      var temp, title, $tempDiv = document.createElement('div'),
      $stickTemp = document.createElement('div');
      e.preventDefault();
      files = $stickerUploadBtn.files;
      title = $stickerInput.value.trim();
      if(title && files && files.length === 1) {
        stickerImg = PHOTOAPP.addImgFileToDom($tempDiv, files[0], false);
        stickerImg.classList.add('sticker-img');

        temp = $stickerTemplate.innerHTML;
        temp = temp.replace('{{stickerImg}}', $tempDiv.innerHTML);
        temp = temp.replace('{{title}}', title);

        $stickTemp.innerHTML = temp;

        $stickerArea.insertBefore($stickTemp.getElementsByClassName('sticker')[0], $stickerArea.firstChild);

        $stickerModal.style.display = 'none';
      }
    });
  }
  PHOTOAPP.init();

})(window.PHOTOAPP = window.PHOTOAPP || {});
