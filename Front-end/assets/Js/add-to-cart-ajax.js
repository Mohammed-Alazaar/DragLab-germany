$(document).ready(function() {
  // Optional: don't cache ajax to force the content to be fresh
  $.ajaxSetup({
      cache: false
  });

  // Add to cart button click event
  $('.ajax-add-to-cart-button').click(function(event) {
      event.preventDefault(); // Prevent the default form submission
      const button = $(this);
      const form = button.closest('.ajax-add-to-cart-form');
      const formData = form.serialize();
      const imgElement = form.find('#addtocart');
      const svgElement = form.find('#checkmark');

      $.ajax({
          url: '/cart-ajax',
          type: 'POST',
          data: formData,
          dataType: 'json',
          success: function(data) {
              if (data.message === 'Product added to cart') {
                  // Update the cart item count with animation
                  const cartItemCountElement = $('.nav-bar-icons-basket-item-number');
                  if (cartItemCountElement.length) {
                      cartItemCountElement.addClass('animate');
                      setTimeout(function() {
                          cartItemCountElement.removeClass('animate');
                          cartItemCountElement.text(data.cartItemCount);
                      }, 300); // Match this timeout with the CSS transition duration
                  }

                  // Play the SVG animation and hide the image
                  imgElement.hide();
                  svgElement.show();
                  setTimeout(function() {
                      svgElement.hide();
                      imgElement.show();
                  }, 3000); // Show the SVG for 3 seconds

                  console.log('Product added to cart');
              } else {
                  console.error('Failed to add product to cart:', data.message);
              }
          },
          error: function(err) {
              console.error('Error:', err);
              console.error('Response:', err.responseText);
          }
      });
  });
});
