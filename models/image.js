var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    picName  = require('../utils/picture_name'),
    timestamps = require('mongoose-timestamp')

var ImageSchema = new Schema({
  fullName: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

ImageSchema.plugin(timestamps)

var S3URL = "https://blenda.s3.amazonaws.com/"

ImageSchema.methods.location = function(size){
  return S3URL + picName(this.fullName, size)
}

module.exports = mongoose.model('Image', ImageSchema)
