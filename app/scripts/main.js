'use strict';
(function(PHOTOAPP){
  var stickers = {};
  var photos = {};

  PHOTOAPP.photoAdded = false;
  PHOTOAPP.currentDraggedImage = null;

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
      photos[id] = undefined;
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
    var initLib = PHOTOAPP.getSavedItem('stickersLib');
    var initPhotos = PHOTOAPP.getSavedItem('photos');
    if(initLib) {
      stickers = initLib;
    }
    if(initPhotos) {
      photos = initPhotos;
    }
  }
  PHOTOAPP.init();

})(window.PHOTOAPP = window.PHOTOAPP || {});
