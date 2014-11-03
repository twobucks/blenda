var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    findOrCreate = require('mongoose-findorcreate'),
    timestamps = require('mongoose-timestamp')

var BetaInviteSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    trim: true
  }
})

BetaInviteSchema.plugin(findOrCreate)
BetaInviteSchema.plugin(timestamps)

BetaInviteSchema.path('email').validate(function (value) {
  return /@/i.test(value);
}, 'Invalid email');

module.exports = mongoose.model('BetaInvite', BetaInviteSchema)

