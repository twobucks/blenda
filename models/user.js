var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    findOrCreate = require('mongoose-findorcreate')

var UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    trim: true
  },
  name: String,
  gravatar: String,
  dropbox:{
    id: String,
    token: String,
    cursor: String,
    isProcessing: Boolean
  },
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }]
})

UserSchema.plugin(findOrCreate)

UserSchema.methods.resetDropbox = function(next){
  var next = next || function(){}
  this.dropbox.cursor = null
  this.dropbox.isProcessing = false
  this.save(next(this))
}

module.exports = mongoose.model('User', UserSchema)

