function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function isColorDark(rgb) {
  var rgb, yiq;
  if (typeof rgb === 'string'){ rgb = colorStringToRGB(rgb); }
  yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return yiq < 128;
}

function isColorLight(rgb) {
  return !isColorDark(rgb);
}

function colorStringToRGB(str){
  var re, parts, rgb, str;
  if (/^rgb/i.test(str)) {
    re = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)$/;
    parts = str.match(re).slice(1,4);
    rgb = { r: parts[0], g: parts[1], b: parts[2] };
  } else {
    str = str.replace('#', '');
    rgb = {
      r: parseInt(str.slice(0,2), 16),
      g: parseInt(str(2,4), 16),
      b: parseInt(str(4,6), 16)
    };
  }
  return rgb
}

function listColorSwatches() {
  // list the color swatches
  $('.js-color-swatch').each(function(el){
    var el = $(this),
        rgb = el.find('> div').css('backgroundColor');

    el.find('.js-color-info').remove();

    el.find('p').append(
      '<span class="js-color-info f-db f-fs-xsmall">' + rgb + '</span>'
    ).append(
      '<span class="js-color-info f-db f-fs-xsmall">' + rgb2hex(rgb) + '</span>'
    );
  });
}



$(function(){
  'use strict';

  // list the color swatches
  listColorSwatches();


  // add links to the app ribbon for each of sections
  $('section').each(function(i){
    var el = $(this),
        linkTarget = $('.js-section-list'),
        id = el.attr('id');
    if (i > 0) {
      linkTarget.append(
        '<li class="f-bg-hover-light two f-p-xsmall f-clickable f-caps f-fw-bold f-br-small"><a class="f-db" href="#' + id + '">' + id + '</li>'
      );
    }
  });


  // make alternating sections a dark background
  $('body > section').each(function(i){
    var el = $(this);
    if ((i + 1) % 2 === 0){
      el.addClass('f-bg-swatchfive');
    }
  });


  // add the theme functionality
  var themeTemplate = $('#theme-template').text();
  $('.js-theme').click(function(){
    var theme, newTheme, primaryColor, primaryTextColor, appRibbonColor, appRibbonTextColor, footerColor, footerTextColor;

    theme = $(this);

    primaryColor = theme.find('div:eq(1)').css('backgroundColor');
    appRibbonColor = theme.find('div:eq(0)').css('backgroundColor');
    footerColor = theme.find('div:eq(2)').css('backgroundColor');

    if (isColorDark(primaryColor)){
      primaryTextColor = 'white';
    } else {
      primaryTextColor = 'black';
    }

    if (isColorDark(appRibbonColor)){
      appRibbonTextColor = 'white';
    } else {
      appRibbonTextColor = 'black';
    }

    if (isColorDark(footerColor)){
      footerTextColor = 'white';
    } else {
      footerTextColor = 'black';
    }

    newTheme = themeTemplate
      .replace(/{{primaryColor}}/g, primaryColor)
      .replace(/{{primaryTextColor}}/g, primaryTextColor)
      .replace(/{{appRibbonColor}}/g, appRibbonColor)
      .replace(/{{appRibbonTextColor}}/g, appRibbonTextColor)
      .replace(/{{footerColor}}/g, footerColor)
      .replace(/{{footerTextColor}}/g, footerTextColor);

    $('#theme-target').html(newTheme);
    listColorSwatches();
  });

  $('.js-font-families > div').each(function(){
    var $el = $(this),
        font = $el.css('fontFamily').split(',')[0];

    $el.find('span').html(font);
  });

  $('.f-app-ribbon .collapse-icon').click(function(){
    $('.f-app-ribbon .right').toggleClass('show');
  });
});