(function () {
  var nav = document.querySelector('.nav-toggle');
  var toggleState = function (elem, one, two) {
      var elem = document.querySelector(elem);
      elem.setAttribute('data-state', elem.getAttribute('data-state') === one ? two : one);
  };
  
  nav.onclick = function (e) {
      toggleState('.nav-main ul', 'closed', 'open');
      e.preventDefault();
  };
})();