var imagesLoaded          = require('imagesloaded'),
    raf                   = require('raf'),
    ScrollHandler         = require('./scroll_handler')

$(function(){

  var lastScroll = $(window).scrollTop();
  var animating = false
  $(window).on('scroll', function parallax(){
    var scroll = $(window).scrollTop(),
        delta  = scroll - lastScroll
    if (delta > 0 && delta < 100 && scroll < $('.bg').height() && !animating){
      animating = true
      $('html, body').animate({
          scrollTop: $(".grid").offset().top
      }, 1000, function(){
        animating = false
      });
    }
    if (delta < 0 && delta < 100 && scroll <= $('.bg').height() && !animating){
      animating = true
      $('html, body').animate({
          scrollTop: 0
      }, 1000, function(){
        animating = false
        lastScroll = 0
      });
    }
    lastScroll = scroll
  })

  // image grid
  $(window).
    off('scroll', function(e) { ScrollHandler(e, fetch) }).
    on('scroll', function(e) { ScrollHandler(e, fetch) })

  var container     = document.querySelector('.grid'),
      imagesHTML    = container.innerHTML,
      pending       = false
      page          = 1
      pack          = undefined

  imagesLoaded(container, function(){
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

  function fetch(){
    $.ajax({
      url: '/',
      dataType: 'json',
      data: {page: ++page}
    }).done(function(response){
      var images = response.data
      var fragment = document.createDocumentFragment()
      images = $.each(images, function(i, image){
        console.log(image)
        var img = document.createElement('div')
        var style = "background: " + image.color +
          " url('" + image.url + "') no-repeat left top;" +
          " background-size: contain"
        img.setAttribute('style', style)
        $(img).attr('data-height', image.height)
        $(img).attr('data-width', image.width)

        fragment.appendChild(img)
      })
      pack.append(fragment)
    })
  }

  function append(imagesHTML) {
    var frag = document.createElement('div')
    frag.innerHTML = imagesHTML
    pack.append(frag.children)
  }
})
