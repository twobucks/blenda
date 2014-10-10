$(function(){
  $('.images').focus()
  $('.images li:first').addClass('active')

  var keyCodes = {
    '37': 'left',
    '39': 'right',
    '32': 'space',
    '72': 'h',
    '76': 'l'
  }

  $('body').keydown(function(e){
    e = e || window.event;

    var images = $('ul.images'),
        active = $('ul.images li.active')

    var markActive = function(target){
      if (target.length > 0){
        images.animate({
          scrollLeft: images.scrollLeft() + target.position().left + 40
        }, 200)
        active.removeClass('active')
        target.addClass('active')
      }
    }

    switch(keyCodes[e.keyCode]){
      case 'left':
      case 'h':
        markActive(active.prev('li'))
        break
      case 'right':
      case 'l':
      case 'space':
        markActive(active.next('li'))
        break
    }
  })
})
