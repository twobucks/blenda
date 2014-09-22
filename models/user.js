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
  },
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }]
})

UserSchema.plugin(findOrCreate)
module.exports = mongoose.model('User', UserSchema)

