var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    picName  = require('../utils/picture_name'),
    timestamps = require('mongoose-timestamp')

var ImageSchema = new Schema({
  fullName: String,
  host: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

ImageSchema.plugin(timestamps)

ImageSchema.methods.url = function(size){
  return this.host + "/" + picName(this.fullName, size)
}

module.exports = mongoose.model('Image', ImageSchema)
