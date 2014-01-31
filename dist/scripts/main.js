function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


// list the color swatches
$('.js-color-swatch').each(function(el){
  var el = $(this),
      rgb = el.find('> div').css('backgroundColor');

  el.find('p').append(
    '<span class="f-db f-fs-xsmall">' + rgb + '</span>'
  ).append(
    '<span class="f-db f-fs-xsmall">' + rgb2hex(rgb) + '</span>'
  );
});


// add links to the app ribbon for each of sections
$('section').each(function(el, i){
  var el = $(this),
      linkTarget = $('.js-section-list'),
      id = el.attr('id');

  linkTarget.append(
    '<li class="f-bg-hover-swatchfive f-caps f-fw-bold"><a href="#' + id + '">' + id + '</li>'
  );
});