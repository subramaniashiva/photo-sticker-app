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
  PHOTOAPP.photoAdded = false;
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
      var img;
      files = this.files;
      if(files.length === 1) {
        img = PHOTOAPP.addImgFileToDom($canvasArea, files[0], true);
        img.classList.add('main-image');
        PHOTOAPP.photoAdded = true;
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
    var dragged;
    document.addEventListener('dragstart', function(event) {
        if(PHOTOAPP.photoAdded && event.target.classList.contains('sticker-img')) {
          dragged = event.target;
        }
    });
    $canvasArea.addEventListener('drop', function(event) {
      var img, canvas, context, dataurl, parent;
      console.log(event);
      if(dragged && PHOTOAPP.photoAdded) {
        event.preventDefault();

        img = document.createElement('img');

        canvas = document.createElement("canvas")
        context = canvas.getContext("2d")
        context.drawImage(dragged, 0, 0);
        dataurl = canvas.toDataURL("image/png", 1);
        img.classList.add('dropped-sticker');
        img.style.left = (event.offsetX - event.toElement.offsetLeft - 30) + "px";
        img.style.top = (event.offsetY - event.toElement.offsetTop - 30) + "px";
        img.src = dataurl;
        parent = this;
        img.onload = function() {
          parent.appendChild(img);
        };
        dragged = null;
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
        stickerImg.draggable = true;
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
