var imagesLoaded          = require('imagesloaded'),
    raf                   = require('raf')

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

    var leftPosition = function(target){
        var position = images.scrollLeft() + target.position().left

        // center it on page
        position -= (images.width() - target.width()) / 2
        return position
    }

    var markActive = function(target){
      if (target.length > 0){
        images.animate({
          scrollLeft: leftPosition(target)
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

  var container = document.querySelector('.grid')
  var imagesHTML = container.innerHTML
  var pack
  var pending = false

  imagesLoaded(container, function(){
    $('img').each(function(){
      $(this).attr('data-height', $(this).height())
      $(this).attr('data-width', $(this).width())
    })

    pack = new HorizontalGridPacking(container, {
      height: 500,
      padding: 2
    })

    window.addEventListener('resize', function queue() {
      if (pending) return
      pending = true
      raf(function () {
        pack.width = container.clientWidth
        pack.height = Math.max(Math.round(window.outerHeight / Math.PI), 120)
        pack.reload()
        pending = false
      })
    })
  })

  function append() {
    var frag = document.createElement('div')
    frag.innerHTML = imagesHTML
    pack.append(frag.children)
  }
})
