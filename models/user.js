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
    token: String
  }
})

UserSchema.plugin(findOrCreate)
mongoose.model('User', UserSchema)
