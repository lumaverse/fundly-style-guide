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