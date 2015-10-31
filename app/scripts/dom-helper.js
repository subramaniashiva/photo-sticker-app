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