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
  dropboxID: {
    type: String,
    default: ''
  }
})

UserSchema.plugin(findOrCreate)
mongoose.model('User', UserSchema)
