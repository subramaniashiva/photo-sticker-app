'use strict';
(function(DOMHELPER) {
  // Helper function to remove all child nodes of a DOM element
  DOMHELPER.removeChildNodes = function(node) {
    if (node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    return node;
  }
})(window.DOMHELPER = window.DOMHELPER || {});

document.addEventListener('DOMContentLoaded', function() {
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
	$stickerTemplate = document.getElementById('sticker-template'),
  $mainImgTemplate = document.getElementById('main-image-template'),
  $stickerImgTemplate = document.getElementById('sticker-img-template'),
  $photoStickerTemplate = document.getElementById('photo-sticker-template'),
  $photoLink = document.getElementById('choose-photo-link'),
  $stickerLink = document.getElementById('choose-sticker-link');

  function initApplicationDom() {
    var i, photos = PHOTOAPP.getAllPhotos(),
        libStickers = PHOTOAPP.getAllLibStickers(),
        imgTemplate,
        stickerTemplate,
        stickerImgTemplate,
        tempStickers = '',
        photoStickerTemplate = '',
        tempPhotoStickers = '',
        stickArray;
    if(photos) {
      for(i in photos) {
        if(photos[i]) {
          imgTemplate = $mainImgTemplate.innerHTML;
          imgTemplate = imgTemplate.replace('{{id}}', i);
          imgTemplate = imgTemplate.replace('{{srcString}}', photos[i].srcString);
          stickArray = photos[i].stickers;
          if(stickArray.length > 0) {
            for(var j = 0; j < stickArray.length; j++) {
              photoStickerTemplate = $photoStickerTemplate.innerHTML;
              for(var k in stickArray[j]) {
                photoStickerTemplate = photoStickerTemplate.replace('{{'+k+'}}', stickArray[j][k]);
              }
              tempPhotoStickers += photoStickerTemplate;
            }
          }
          $canvasArea.innerHTML = imgTemplate + tempPhotoStickers;
          PHOTOAPP.photoAdded = true;
        }
      }
    }
    if(libStickers) {
      for(i in libStickers) {
        if(libStickers[i]) {
          stickerTemplate = $stickerTemplate.innerHTML;
          stickerTemplate = stickerTemplate.replace('{{title}}', libStickers[i].name);
          stickerImgTemplate = $stickerImgTemplate.innerHTML;
          stickerImgTemplate = stickerImgTemplate.replace('{{id}}', i);
          stickerImgTemplate = stickerImgTemplate.replace('{{srcString}}', libStickers[i].srcString);
          stickerTemplate = stickerTemplate.replace('{{stickerImg}}', stickerImgTemplate);
          tempStickers += stickerTemplate;
        }
      }
      $stickerArea.innerHTML += tempStickers;
    }
  }
	initApplicationDom();
	$stickerArea.addEventListener('click', function(e) {
	  if(e.target.classList.contains('sticker-remove')) {
	    var stickerImg = e.target.parentElement.getElementsByClassName('sticker-img')[0];
	    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
	    PHOTOAPP.deleteLibSticker(stickerImg.dataset.stickerId);
	  }
	});

	$photoUploadBtn.addEventListener('change', function() {
	  var img = document.createElement('img'), reader, oldImage = document.getElementsByClassName('main-image');
	  files = this.files;
	  if(files.length === 1) {
	    reader = PHOTOAPP.filesToImgElem(files[0]);
	    reader.onload = function(e) {
        if(oldImage && oldImage.length > 0) {
          PHOTOAPP.deletePhoto(oldImage[0].dataset.photoId);
        }
	      PHOTOAPP.addPhoto(photoId, e.target.result);
	      img.dataset.photoId = photoId;
	      img.src = e.target.result;
	      img.classList.add('main-image');
	      DOMHELPER.removeChildNodes($canvasArea);
	      $canvasArea.appendChild(img);

	      PHOTOAPP.addPhoto(photoId, e.target.result);
	      
	      PHOTOAPP.photoAdded = true;
	      photoId++;
	    }  
	  }
	});
  $photoLink.addEventListener('click', function() {
    $photoUploadBtn.click();
  });
  
	$addSticker.addEventListener('click', function() {
	  $stickerForm.reset(); 
	  $stickerInput.value = '';
	  $stickerModal.style.display = 'block';
	});

  $stickerLink.addEventListener('click', function() {
    $stickerUploadBtn.click();
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
  
});
