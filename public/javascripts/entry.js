var riot = require('riotjs')

function Entry(){
  var self = riot.observable(this)

  self.value = "ready to make some riot?"

  self.change = function(value){
    self.value = value
    self.trigger('change')
  }
}

module.exports = Entry;
