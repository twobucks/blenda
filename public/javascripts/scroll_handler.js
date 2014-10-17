var _throttleTimer = null
var _throttleDelay = 100

var offset = 10 // offset after witch a fetch will get executed

function getDocHeight(){
    return Math.max(
        $(document).height(),
        $(window).height(),
        /* For opera: */
        document.documentElement.clientHeight
    )
}

module.exports = function(e, next){
    clearTimeout(_throttleTimer);
    _throttleTimer = setTimeout(function () {
        if ($(window).scrollTop() + $(window).height() > getDocHeight() - offset) {
          next()
        }

    }, _throttleDelay)
}
