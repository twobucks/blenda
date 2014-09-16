var riot = require('riotjs')

function presenter(el, options){
  var element = $(el),
      template = options.template,
      model = options.model,
      result = $('.right'),
      that = this

  model.on("change", rerender)

  element.on('keyup', function(){
    model.change(this.value)
  })

  rerender()
  function rerender(){
    var data = {
      text: model.value
    }
    result.html(riot.render(template, data))
  }
}

module.exports = presenter;
