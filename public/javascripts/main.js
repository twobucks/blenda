var presenter = require('./presenter'),
    Entry = require('./entry')

$(function(){
  var model = new Entry()

  $("textarea").html("ready to make some riot?")

  presenter($("textarea"), {
    template: $("#main-template").html(),
    model: model
  })
})
