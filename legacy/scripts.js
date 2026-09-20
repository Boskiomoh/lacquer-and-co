/* Lacquer & Co. site scripts. jQuery 1.12 */
$(document).ready(function () {

  // Homepage slider
  var current = 0;
  var slides = $('#slider .slide');

  function show(i) {
    slides.removeClass('active');
    current = (i + slides.length) % slides.length;
    $(slides[current]).addClass('active');
  }

  $('#slider .next').click(function () { show(current + 1); });
  $('#slider .prev').click(function () { show(current - 1); });

  setInterval(function () { show(current + 1); }, 6000);

  // Contact form
  // TODO: hook this up to the mail script on the new server
  $('#send').click(function () {
    $('#contact-form')[0].reset();
  });

});
