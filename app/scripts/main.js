'use strict';
(function(PHOTOAPP){
  var stickers = {};
  var photos = {};

  PHOTOAPP.photoAdded = false;
  PHOTOAPP.currentDraggedImage = null;

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
  PHOTOAPP.filesToImgElem = function(fileObj, img) {
    var reader;
    if(fileObj) {
      reader = new FileReader();
      reader.readAsDataURL(fileObj);

      //img.src = window.URL.createObjectURL(fileObj);
      //img.onload = function() {
      //  window.URL.revokeObjectURL(this.src);
      //}
    }
    return reader;
  }
  PHOTOAPP.saveItem = function(key, value) {
    if(localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
  PHOTOAPP.getSavedItem = function(key) {
    if(localStorage && localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key));
    }
  }
  PHOTOAPP.addLibSticker = function(id, srcString, name) {
    id = id.toString();
    if(!stickers[id]) {
      stickers[id] = {};
      stickers[id].srcString = srcString;
      stickers[id].name = name;
      PHOTOAPP.saveItem('stickersLib', stickers);
      return stickers[id];
    }
    return false;
  }
  PHOTOAPP.deleteLibSticker = function(id) {
    id = id.toString();
    if(stickers[id]) {
      stickers[id] = undefined;
      PHOTOAPP.saveItem('stickersLib', stickers);
      return true;
    }
    return false;
  }
  PHOTOAPP.updateLibSticker = function(id, srcString) {
    id = id.toString();
    if(stickers[id] && srcString) {
      stickers[id].srcString = srcString;
      PHOTOAPP.saveItem('stickersLib', stickers);
      return stickers[id];
    }
    return false;
  }
  PHOTOAPP.getLibSticker = function(id) {
    return stickers[id.toString()];
  }
  PHOTOAPP.getAllLibStickers = function() {
    return stickers;
  }
  PHOTOAPP.addPhoto = function(id, srcString) {
    id = id.toString();
    if(!photos[id]) {
      photos[id] = {};
      photos[id].srcString = srcString;
      photos[id].stickers = [];
      PHOTOAPP.saveItem('photos', photos);
      return photos[id];
    }
  }
  PHOTOAPP.deletePhoto = function(id) {
    id = id.toString();
    if(photos[id]) {
      photos[id] = null;
      PHOTOAPP.saveItem('photos', photos);
      return true;
    }
    return false;
  }
  PHOTOAPP.updatePhoto = function(id, srcString) {
    id = id.toString();
    if(photos[id] && srcString) {
      photos[id].srcString = srcString;
      PHOTOAPP.saveItem('photos', photos);
      return photos[id];
    }
    return false;
  }
  PHOTOAPP.getPhoto = function(id) {
    return photos[id.toString()];
  }
  PHOTOAPP.getAllPhotos = function() {
    return photos;
  }
  PHOTOAPP.addStickerToPhoto = function(photoId, stickerId, stickerString, left, top) {
    if(photos[photoId.toString()]) {
      var stickerObj = {};
      stickerObj.stickerId = stickerId.toString();
      stickerObj.srcString = stickerString;
      stickerObj.left = left;
      stickerObj.top = top;
      photos[photoId].stickers.push(stickerObj);
      PHOTOAPP.saveItem('photos', photos);
      return photos[photoId];
    }
    return false;
  }
  PHOTOAPP.updateStickerInPhoto = function(photoId, stickerId, stickerString, left, top) {
    photoId = photoId.toString();
    stickerId = stickerId.toString();
    if(photos[photoId] && photos[photoId].stickers.length) {
      var stickerArray = photos[photoId].stickers;
      for(var i = 0; i < stickerArray.length; i++) {
        if(stickerArray[i].stickerId === stickerId) {
          if(stickerString)
            stickerArray[i].srcString = stickerString;
          if(left)
            stickerArray[i].left = left;
          if(top)
            stickerArray[i].top = top;
          PHOTOAPP.saveItem('photos', photos);
          return photos[photoId];
        }
      }
    }
    return false;
  }
  PHOTOAPP.init = function() {

    var files;
    var stickerId = 0;
    var photoId = 0;
    var addedStickerId = 0;
    var $photoUploadBtn = document.getElementById('photo-upload'),
    $canvasArea = document.getElementById('canvas-area'),
    $stickerArea = document.getElementById('sticker-area'),
    $addSticker = document.getElementById('add-sticker'),
    $stickerModal = document.getElementById('sticker-modal'),
    $stickerForm = document.getElementById('sticker-form'),
    $stickerInput = document.getElementById('sticker-input'),
    $stickerUploadBtn = document.getElementById('sticker-upload'),
    $stickerTemplate = document.getElementById('sticker-template');
    var initLib = PHOTOAPP.getSavedItem('stickersLib');
    var initPhotos = PHOTOAPP.getSavedItem('photos');
    if(initLib) {
      stickers = initLib;
    }
    if(initPhotos) {
      photos = initPhotos;
    }
    $stickerArea.addEventListener('click', function(e) {
      if(e.target.classList.contains('sticker-remove')) {
        var stickerImg = e.target.parentElement.getElementsByClassName('sticker-img')[0];
        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
        PHOTOAPP.deleteLibSticker(stickerImg.dataset.stickerId);
      }
    });
    $photoUploadBtn.addEventListener('change', function() {
      var img = document.createElement('img'), reader;
      files = this.files;
      if(files.length === 1) {
        reader = PHOTOAPP.filesToImgElem(files[0]);
        reader.onload = function(e) {
          PHOTOAPP.addPhoto(photoId, e.target.result);
          img.dataset.photoId = photoId;
          img.src = e.target.result;
          img.classList.add('main-image');
          PHOTOAPP.removeChildNodes($canvasArea);
          $canvasArea.appendChild(img);

          PHOTOAPP.addPhoto(photoId, e.target.result);
          
          PHOTOAPP.photoAdded = true;
          photoId++;
        }  
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
    document.addEventListener('dragstart', function(event) {
        var classList = event.target.classList;
        if(PHOTOAPP.photoAdded && (classList.contains('sticker-img') || classList.contains('dropped-sticker'))) {
          PHOTOAPP.currentDraggedImage = event.target;
        }
    });
    function getCurrentPhotoInCanvas() {
      var elem;
      var list = document.getElementsByClassName('main-image');
      if(list && list.length > 0) {
        elem = list[0];
      }
      return elem;
    }
    $canvasArea.addEventListener('drop', function(event) {
      var img, parent, classList, photoElem;
      console.log(event);
      if(PHOTOAPP.photoAdded) {
        event.preventDefault();
        if(PHOTOAPP.currentDraggedImage) {
          photoElem = getCurrentPhotoInCanvas();
          classList = PHOTOAPP.currentDraggedImage.classList;

          if(classList.contains('sticker-img')) {
            img = document.createElement('img');
            img.src = PHOTOAPP.currentDraggedImage.src;
            img.dataset.id = addedStickerId;
            img.classList.add('dropped-sticker');
            img.style.left = (event.offsetX - 75) + "px";
            img.style.top = (event.offsetY - 75) + "px";
            
            PHOTOAPP.addStickerToPhoto(photoElem.dataset.photoId, addedStickerId, img.src, img.style.left, img.style.top);
            
            parent = this;

            img.onload = function() {
              parent.appendChild(img);
            };
            addedStickerId++;
          } else if (classList.contains('dropped-sticker')) {
            img = PHOTOAPP.currentDraggedImage;
            img.style.left = (event.offsetX - 75) + "px";
            img.style.top = (event.offsetY - 75) + "px";

            PHOTOAPP.updateStickerInPhoto(photoElem.dataset.photoId, img.dataset.id, undefined, img.style.left, img.style.top);
          }
        }
        

        /*canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        canvas.style.width = "150px";
        canvas.style.height = "150px";
        context.drawImage(dragged, 0, 0);
        dataurl = canvas.toDataURL("image/png", 1);*/
        
        //var viewportOffset = event.toElement.getBoundingClientRect();
        // these are relative to the viewport
        //var top = viewportOffset.top;
        //var left = viewportOffset.left;

        
        PHOTOAPP.currentDraggedImage = null;
      }
    });
    
    $stickerForm.addEventListener('submit', function(e) {
      var reader, temp, title, $tempDiv = document.createElement('div'),
      stickerImg = document.createElement('img'),
      $stickTemp = document.createElement('div');
      e.preventDefault();
      files = $stickerUploadBtn.files;
      title = $stickerInput.value.trim();
      if(title && files && files.length === 1) {
        reader = PHOTOAPP.filesToImgElem(files[0], stickerImg);
        reader.onload = function(e) {
          stickerImg.src = e.target.result;
          stickerImg.dataset.stickerId = stickerId;
          $tempDiv.appendChild(stickerImg);

          stickerImg.draggable = true;
          stickerImg.classList.add('sticker-img');

          temp = $stickerTemplate.innerHTML;
          temp = temp.replace('{{stickerImg}}', $tempDiv.innerHTML);
          temp = temp.replace('{{title}}', title);

          $stickTemp.innerHTML = temp;

          $stickerArea.insertBefore($stickTemp.getElementsByClassName('sticker')[0], $stickerArea.firstChild);

          $stickerModal.style.display = 'none';
          PHOTOAPP.addLibSticker(stickerId, stickerImg.src, title);
          stickerId++;
        }
        

      }
    });
  }
  PHOTOAPP.init();

})(window.PHOTOAPP = window.PHOTOAPP || {});
