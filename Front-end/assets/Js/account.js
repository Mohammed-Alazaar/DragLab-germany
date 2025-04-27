$(document).ready(function () {
    $(".edit-button").click(function () {
      const email = $(".email");
      const phone = $(".phone");
      email.replaceWith('<input type="text" class="email" value="' + email.text() + '">');
      phone.replaceWith('<input type="text" class="phone" value="' + phone.text() + '">');
      $(".edit-button").css('display', 'none');
      $(".sendButton").css('display', 'block');
    });
    $("#saveButton").click(function () {
      const emailInput = $(".email");
      const phoneInput = $(".phone");
      const newEmail = emailInput.val();
      const newPhone = phoneInput.val();
      emailInput.replaceWith('<p class="email">' + newEmail + '</p>');
      phoneInput.replaceWith('<p class="phone">' + newPhone + '</p>');
      $(".edit-button").css('display', 'block');
      $(".sendButton").css('display', 'none');
    });
  });
  
  
  
  
  
  $(document).ready(function () {
    $(".edit-button2").click(function () {
      const district = $(".district");
      const city = $(".city");
      district.replaceWith('<input type="text" class="district" value="' + district.text() + '">');
      city.replaceWith('<input type="text" class="city" value="' + city.text() + '">');
      $(".edit-button2").css('display', 'none');
      $("#saveButton2").css('display', 'block');
    });
  
    $("#saveButton2").click(function () {
      const districtInput = $(".district");
      const cityInput = $(".city");
      districtInput.replaceWith('<p class="district">' + districtInput.val() + '</p>');
      cityInput.replaceWith('<p class="city">' + cityInput.val() + '</p>');
      $(".edit-button2").css('display', 'block');
      $("#saveButton2").css('display', 'none');
    });
  });
  