var _throttleTimer = null
var _throttleDelay = 100

function getDocHeight(){
    return Math.max(
        $(document).height(),
        $(window).height(),
        /* For opera: */
        document.documentElement.clientHeight
    )
}

function fetchMore(){
}

module.exports = function(e, next){
    clearTimeout(_throttleTimer);
    _throttleTimer = setTimeout(function () {
        if ($(window).scrollTop() + $(window).height() > getDocHeight() - 400) {
          next()
        }

    }, _throttleDelay)
}
