var imagesLoaded = require('imagesloaded')


$(function(){
  $('.item').hide()
  var container = $('#container');
  imagesLoaded(container, function(){
    $(".item").show()
    container.masonry({
      itemSelector : '.item',
      columnWidth : 200,
      singleMode: true
    });
  });
})

