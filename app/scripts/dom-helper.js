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
  DOMHELPER.enable = function(element) {
    if (element) {
        element.removeAttribute('disabled');
    }
  }
  DOMHELPER.disable = function(element) {
    if(element) {
      element.setAttribute('disabled', true);
    }
  }
})(window.DOMHELPER = window.DOMHELPER || {});
