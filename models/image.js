var mongoose = require('mongoose'),
    Schema   = mongoose.Schema

var ImageSchema = new Schema({
  name: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Image', ImageSchema)
