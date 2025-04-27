//  for the slideshow on the product details page
$(document).ready(function () {
         // Hide model container
        $('.model-container').css('display', 'none');
    // Change main image to clicked thumbnail and update selection
    $('.slideshow-photos-container-photo img').click(function () {
        $('.product-container-photos-container-view img').css('display', 'block');

        var newImageSrc = $(this).attr('src');
        $('.product-container-photos-container-view img').attr('src', newImageSrc);

        // Remove the 'selected' id from all slideshow photos
        $('.slideshow-photos-container-photo').removeAttr('id');
        $('.model-button-container').removeAttr('id');

        // Add the 'selected' id to the clicked photo's parent div
        $(this).parent('.slideshow-photos-container-photo').attr('id', 'selected');

        $('.model-container').css('display', 'none');

    });

    // Slideshow controls
    $('#right-arrow').click(function () {
        $('.slideshow-photos-container').animate({
            scrollLeft: '+=100'
        }, 200);
    });

    $('#left-arrow').click(function () {
        $('.slideshow-photos-container').animate({
            scrollLeft: '-=100'
        }, 200);
    });
      // Show 3D model container when button is clicked
      $('.show-model-button').click(function () {
        $('.model-container').css('display', 'block');
        $('.product-container-photos-container-view img').css('display', 'none');
         // Remove the 'selected' id from all slideshow photos
         $('.slideshow-photos-container-photo').removeAttr('id');

         // Add the 'selected' id to the clicked photo's parent div
         $('.model-button-container').attr('id', 'selected');

    });
});


// for the zoom effect on the product details page

$('.product-container-photos-container-view').on('mousemove', function (e) {
    var $container = $(this),
        $image = $container.find('img'),
        containerWidth = $container.width(),
        containerHeight = $container.height(),
        mouseX = e.pageX - $container.offset().left,
        mouseY = e.pageY - $container.offset().top;

    // Assuming the image is scaled 2x
    var scale = 2;

    // Calculate the new position
    var newX = (containerWidth / 2 - mouseX) * (scale - 1);
    var newY = (containerHeight / 2 - mouseY) * (scale - 1);

    // Apply the new position
    $image.css({
        'transform': 'scale(' + scale + ')',
        'transform-origin': mouseX + 'px ' + mouseY + 'px',
        'transition': 'none'
    });
}).on('mouseleave', function (e) {
    var $image = $(this).find('img');
    // Reset the transform when not hovering
    $image.css({
        'transform': 'scale(1)',
        'transition': 'transform 0.25s ease'
    });
});





document.getElementById('increase').addEventListener('click', function () {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('quantity').value = value;
});

document.getElementById('decrease').addEventListener('click', function () {
    var value = parseInt(document.getElementById('quantity').value, 10);
    value = isNaN(value) ? 0 : value;
    value = value < 2 ? 1 : value - 1;
    document.getElementById('quantity').value = value;
});








// implement a toggle slide functionality for the sections

$(document).ready(function() {
    // Bind a click event listener to the headers
    $('.product-spacification-header, .product-details-header, .product-reviews-header').click(function() {
        // Toggle the visibility of the next sibling element (the container) with a slide effect
        $(this).next().slideToggle('slow');
        
        // Find the image within the clicked header and toggle the 'rotate' class to rotate the arrow
        $(this).find('img').toggleClass('rotate');
    });
});


// for the scroll to top button

$(document).ready(function() {
    // Attach a click event listener to the button
    $('#btnScroolUp').click(function() {
      // Use jQuery's animate function to scroll to the top
      $('html, body').animate({ scrollTop: 0 }, 'slow');
    });
  });





  addToCartButton = document.querySelectorAll(".add-to-cart-button");

  document.querySelectorAll('.add-to-cart-button').forEach(function(addToCartButton) {
      addToCartButton.addEventListener('click', function() {
          addToCartButton.classList.add('added');
          setTimeout(function(){
              addToCartButton.classList.remove('added');
          }, 2000);
      });
  });