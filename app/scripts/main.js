'use strict';
(function(PHOTOAPP){
  var $photoUploadBtn;
  function handleUploadedPhotos(event) {
    console.log(this.files);
  }
  PHOTOAPP.init = function() {
    $photoUploadBtn = document.getElementById('photo-upload');
    $photoUploadBtn.addEventListener('change', handleUploadedPhotos);
  }
  PHOTOAPP.init();

})(window.PHOTOAPP = window.PHOTOAPP || {});
