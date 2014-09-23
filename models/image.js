var mongoose = require('mongoose'),
    Schema   = mongoose.Schema

var ImageSchema = new Schema({
  name: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Image', ImageSchema)
