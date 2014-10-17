var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    picName  = require('../utils/picture_name'),
    timestamps = require('mongoose-timestamp'),
    paginate   = require('mongoose-paginate')

var ImageSchema = new Schema({
  fullName: String,
  host: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  info: {
    height: Number,
    width: Number,
    format: String,
    color: String
  }
})

ImageSchema.plugin(timestamps)
ImageSchema.plugin(paginate)

ImageSchema.methods.url = function(size){
  return this.host + "/" + picName(this.fullName, size)
}

module.exports = mongoose.model('Image', ImageSchema)
