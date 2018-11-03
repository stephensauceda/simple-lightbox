(function () {
  // create a placeholder for our overlay before anything
  createOverlay();
  preloadImages();
  // add an event listener for all elements
  document.addEventListener('click', lightboxClickHandler);

  /**
   * Where the magic happens. Pulls the original img src and calls other functions
   * to append the large image to the lightbox and display it.
   */
  function lightboxClickHandler(event) {
    // the clicked element
    event.preventDefault()
    var node = event.target;
    // only do anything if the clicked element has the 'sms-lightbox' class
    if (node.classList.contains('sms-lightbox')) {
      // stop the default click action for the element
      event.preventDefault();
      // get the original img src
      var src = node.getAttribute('src');
      // get the big image src
      var bigSrc = getSrcForBigImage(src);
      // create the new image element
      var bigImage = createBigImage(bigSrc);
      // append new image to overlay
      appendBigImageToOverlay(bigImage);
    }
  }

  /**
   * Takes the original images src and creates a src for the big image
   */
  function getSrcForBigImage(src) {
    // get the file extension
    // (assumes the first '.' is the start of the file extension)
    var fileExtension = src.slice(src.indexOf('.'));
    // remove the file extension from the image's src
    var pathWithoutExtension = src.replace(fileExtension, '');
    // stitch it all together to get the big src
    var srcForBigImage = pathWithoutExtension + '-big' + fileExtension;
    return srcForBigImage;
  }

  /**
   * Creates the overlay as soon as the script is loaded
   */
  function createOverlay() {
    // create the overlay element
    var overlay = document.createElement('div');
    // give is a class
    overlay.classList.add('sms-lightbox-overlay');
    // stick it in the <body>
    document.body.appendChild(overlay);
  }

  /**
   * Takes an src and returns an img element ready to be appended to the DOM
   */
  function createBigImage(source) {
    // create the img element
    var img = document.createElement('img');
    // set the img source
    img.src = source;
    return img;
  }

  /**
   * Takes an img element and appends it to the .sms-lightbox-overlay element
   * then displays the overlay
   */
  function appendBigImageToOverlay(image) {
    // find the overlay
    var overlay = document.querySelector('.sms-lightbox-overlay');
    // stick the new content in the overlay
    overlay.appendChild(image);
    // unhide the overlay
    overlay.classList.toggle('visible')
    // prevent scrolling of the body while the lightbox is open
    document.body.style.overflow = 'hidden';
    // add a listener for closing the lightbox
    // clicking anywhere while the lightbox is open will close the lightbox
    document.addEventListener('click', closeLightboxHandler)
  }

  /**
   * "Closes" (hides) the overlay, clears it's content and gets it ready for the next image
   */
  function closeLightboxHandler(event) {
    // find the overlay
    var overlay = document.querySelector('.sms-lightbox-overlay');
    // hide the overlay
    overlay.classList.toggle('visible');
    // find the old image
    var child = overlay.querySelector('img');
    // remove the content from the overlay
    overlay.removeChild(child);
    // restore scrolling of the body element since lightbox is closed
    document.body.style.overflow = 'auto';
    // remove the listener since the overlay is now hidden
    document.removeEventListener('click', closeLightboxHandler);
  }

  function preloadImages() {
    // create an array from all the thunbmnails
    var thumbnails = Array.prototype.slice.call(document.querySelectorAll('.sms-lightbox'));
    // convert to a list of big images
    thumbnails.map(function(thumb) {
      var image = new Image();
      image.src = getSrcForBigImage(thumb.getAttribute('src'));
      return image;
    });
  }
})();